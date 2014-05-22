var serialport = require('serialport');
var bufferpack = require('bufferpack');
var u = require('underscore');
var events = require('events');
var fs = require('fs');
var path = require('path');
var PingCommand = require('./messages/PingCommand.js').class;
var SetSerialNumberCommand = require('./messages/SetSerialNumberCommand.js').class;
var SetOutputCommand = require('./messages/SetOutputCommand.js').class;

// Bootstrap message types
var messages = {};
var messagesPath = path.join(__dirname, 'messages');
fs.readdirSync(messagesPath).forEach(function (file) {
  if (path.extname(file) === '.js') {
    var message = require(messagesPath + '/' + file);
    if(message.MESSAGE_ID && message.MESSAGE_ID > 0) {
      messages[message.MESSAGE_ID] = message.class;
    }
  }
});

/**
 * GLOBALS
 */
var DEVICE_GLOB_PATHS = [
  '/dev/ttyUSB',
  '/dev/ttyACM',
  '/dev/cu.usbserial',
  '/dev/tty.usbmodem',
  '/dev/cu.usbmodem'
];

var DEFAULT_KEGBOARD_SPEED = 115200;
var KBSP_PREFIX = new Buffer("KBSP v1:");
var KBSP_PREFIX_BYTES = Array.prototype.slice.call(KBSP_PREFIX, 0);
var KBSP_TRAILER = new Buffer("\r\n");
var KBSP_TRAILER_BYTES = Array.prototype.slice.call(KBSP_TRAILER, 0);
var KBSP_PAYLOAD_MAXLEN = 112;
var KBSP_MAXLEN = KBSP_PAYLOAD_MAXLEN + KBSP_PREFIX.length + KBSP_TRAILER.length;

/**
 * Main KegBoard definition.
 * @constructor
 */
var KegBoard = function(devicePath) {

  this.devicePath = devicePath;
  this.speed = DEFAULT_KEGBOARD_SPEED;
  this.incompleteMessage = null;
  this.serial = null;

  // Constructor of EventEmitter
  events.EventEmitter.call(this);
};

/**
 * Extend EventEmitter to KegBoard prototype chain
 * @private
 */
KegBoard.prototype.__proto__ = events.EventEmitter.prototype;

/**
 * Get KegBoard info as string.
 * @public
 * @returns {String} - Formatted string with KegBoard info
 */
KegBoard.prototype.toString = function() {
  return '<KegBoard path=' + this.devicePath + ' speed=' + this.speed + '>';
};

/**
 * Get KegBoard info as JSON.
 * @public
 * @returns {Object} - Formatted object with KegBoard info
 */
KegBoard.prototype.toJSON = function() {
  return {
    path: this.devicePath,
    speed: this.speed
  };
};

/**
 * Open KegBoard serial port connection and listen for data
 * @public
 * @param {Function} callback - Callback function
 */
KegBoard.prototype.open = function(callback) {
  if(this.serial)
    return callback();

  // Create serial connection to devicePath and bind events
  var self = this;
  this.serial = new serialport.SerialPort(this.devicePath, {baudrate: this.speed}, false);
  this.serial.open(function() {
    self.serial.flush(function(err) {
      if(err) {

      }
      self.serial.on('data', function(buff) {
        self._onSerialData(buff);
      });
      self.serial.on('error', function() {

      });
      self.serial.on('close', function() {

      });

      // Run callback after all events are bound
      callback();
    });
  });
};

/**
 * Serial data event handler.
 * @private
 * @param {Buffer} buff - Chunk of serial data recieved
 */
KegBoard.prototype._onSerialData = function(buff) {
  // Loop through each byte in buffer
  for(var i = 0; i < buff.length; i++) {

    // If incompleteMessage is null, wait for newline byte to reset it.
    if(this.incompleteMessage === null) {
      if(buff[i] === 10) {
        // Reset to empty array
        this.incompleteMessage = [];
      }
      continue;
    }

    // Push byte into incompleteMessage byte array
    this.incompleteMessage.push(buff[i]);

    // Check if incompleteMessage is longer than maximum message length
    if(this.incompleteMessage.length >= KBSP_MAXLEN) {
      // Message is too long, start over
      this.incompleteMessage = null;

    // Check if incompleteMessage DOESNT begin with message prefix
    } else if(!u.isEqual((KBSP_PREFIX_BYTES.slice(0, this.incompleteMessage.length)),
      (this.incompleteMessage.slice(0, KBSP_PREFIX.length)))) {
      // Message does not begin with prefix, start over
      this.incompleteMessage = null;

    // Check if incompleteMessage ends with message trailer
    } else if(u.isEqual(this.incompleteMessage.slice(-2), KBSP_TRAILER_BYTES)) {
      // Full message, make it a Buffer and reset incompleteMessage
      var messageBuff = new Buffer(this.incompleteMessage);
      this.incompleteMessage = [];

      // Handle this complete message
      this._handleCompleteMessage(messageBuff);

    // Otherwise just continue
    } else {
      continue;
    }
  }
};

/**
 * Handle a complete serial message.
 * @private
 * @param {Buffer} buff - Buffer containing complete message
 */
KegBoard.prototype._handleCompleteMessage = function(buff) {
  // Split buffer into message parts
  var header = buff.slice(0, 12);
  var payload = buff.slice(12, -4);

  // Unpack message id and payload length from header
  var idLen = bufferpack.unpack('<HH', header, 8);

  // Form message from id and payload
  var message = this._getMessageById(idLen[0], payload);

  // Emit 'message' event if message was formed
  if(message) {
    this.emit('message', message);
  }
};

/**
 * Form KegBoard message from id and payload buffer.
 * @private
 * @param {Number} id - KegBoard Serial Protocol message type id
 * @param {Buffer} payload - Buffer containing message payload
 */
KegBoard.prototype._getMessageById = function(id, payload) {
  if(typeof messages[id] === 'function') {
    return new messages[id](payload);
  }

  return false;
};

/**
 * Write message to KegBoard
 * @private
 * @param {Buffer} buff - Buffer containing message to write
 */
KegBoard.prototype.write = function(buff) {
  if(!this.serial)
    return false;

  this.serial.write(buff);
};

/**
 * Send a ping message to the KegBoard
 * @public
 */
KegBoard.prototype.ping = function() {
  var pingCommand = new PingCommand();

  this.write(pingCommand.toBuffer());
};

/**
 * Set the serial number of the KegBoard
 * @public
 * @param {String} serialNumber - Serial number to set KegBoard to
 */
KegBoard.prototype.setSerialNumber = function(serialNumber) {
  var setSerialNumberCommand = new SetSerialNumberCommand();
  setSerialNumberCommand.setValue('serial_number', serialNumber);

  this.write(setSerialNumberCommand.toBuffer());
};

/**
 * Enable or disable a KegBoard output.
 * @public
 * @param {Number} outputId - ID of output to enable or disable
 * @param {Boolean} outputMode - Mode to set output to
 */
KegBoard.prototype.setOutput = function(outputId, outputMode) {
  var setOutputCommand = new SetOutputCommand();
  setOutputCommand.setValue('output_id', [+(outputId)]);
  setOutputCommand.setValue('output_mode', [+(outputMode)]);

  this.write(setOutputCommand.toBuffer());
};

/**
 * Check for a connected KegBoard.
 * @public
 * @param {Function} callback - Callback function to handle error or KegBoard instance
 */
exports.checkForKegboard = function(callback) {
  serialport.list(function(err, devices) {
    if(err) {
      return callback(err);
    } else {
      board = null;
      devices.forEach(function(device) {
        DEVICE_GLOB_PATHS.forEach(function(path) {
          if(device.comName.indexOf(path) > -1) {
            board = new KegBoard(device.comName);
            return callback(null, board);
          }
        });
      });

      if(board === null) {
        return callback('No KegBoards found');
      }
    }
  });
};
