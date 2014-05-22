var bufferpack = require('bufferpack');
var crc = require('crc');
var u = require('underscore');

var KBSP_PREFIX = new Buffer("KBSP v1:");
var KBSP_TRAILER = new Buffer("\r\n");

/**
 * Main BaseMessage definition.
 * @constructor
 * @param {Buffer} payload - Buffer containing message payload
 */
var BaseMessage = function(payload) {
  this.id = 0x00;
  this.name = 'BaseMessage';
  this.fields = {};
};

/**
 * Unpack the message's payload
 * @private
 * @param {Buffer} buff - Buffer containing message payload
 */
BaseMessage.prototype._unpackFromPayload = function(buff) {
  var pos = 0;
  var payloadLen = buff.length;
  while((pos + 2) <= payloadLen) {
    var fieldLen = this._parseField(buff.slice(pos));
    pos += 2 + fieldLen;
  }
};

/**
 * Parse a field from the message's payload
 * @private
 * @param {Buffer} buff - Buffer containing single field data from payload
 */
BaseMessage.prototype._parseField = function(buff) {
  var tagLen = bufferpack.unpack('<BB', buff);
  var data = buff.slice(2, 2 + tagLen[1]);
  if(this.fields[tagLen[0]]) {
    //this.fields[tagLen[0]].value = this.fields[tagLen[0]].format(data);
    this.fields[tagLen[0]].value = data;
  }

  return tagLen[1];
};

/**
 * Format a message as a string
 * @public
 * @returns {String} - Message info formatted as a string
 */
BaseMessage.prototype.toString = function() {
  var fieldStr = '';
  var fields = this.fields;
  Object.keys(fields).forEach(function(key) {
    if(fields[key].value !== undefined) {
      fieldStr += ' ' + fields[key].label + '=' + fields[key].format.toString(fields[key].value);
    }
  });
  return '<' + this.name + fieldStr + '>';
};

/**
 * Format a message as a JSON object
 * @public
 * @returns {Object} - Message info formatted as JSON object
 */
BaseMessage.prototype.toJSON = function() {
  var fieldObj = {};
  var fields = this.fields;
  Object.keys(fields).forEach(function(key) {
    if(fields[key].value !== undefined) {
      fieldObj[fields[key].label] = fields[key].format.parseValue(fields[key].value);
    }
  });
  return {id: this.id, name: this.name, fields: fieldObj};
};

/**
 * Format a message as a Buffer
 * @public
 * @returns {Buffer} - Message info formatted as a Buffer
 */
BaseMessage.prototype.toBuffer = function() {
  // Construct payload buffer, loop through fields with values
  var payloadArray = [];
  var fields = this.fields;
  Object.keys(fields).forEach(function(key) {
    if(fields[key].value !== undefined) {
      var bytes = fields[key].format.toBytes(fields[key].value);
      var tagLen = bufferpack.pack('<BB', [key, bytes.length]);
      payloadArray.push(Buffer.concat([tagLen, bytes]));
    }
  });
  var payload = Buffer.concat(payloadArray);

  // Construct main message buffer including prefix, header and payload
  var messageBuff = Buffer.concat([
    KBSP_PREFIX,
    bufferpack.pack('<HH', [this.id, payload.length]),
    payload
  ]);

  // 2 byte CRC-16-CCITT buffer from main message buffer
  var crcBuff = bufferpack.pack('<H', [crc.crc16ccitt(messageBuff)]);

  // Return single buffer including main message, CRC and trailer
  return Buffer.concat([messageBuff, crcBuff, KBSP_TRAILER]);
};

/**
 * Set the value of a message field
 * @public
 * @param {String} fieldLabel - Label of field to set value of
 * @param {Mixed} value - Value to set
 */
BaseMessage.prototype.setValue = function(fieldLabel, value) {
  var fields = this.fields;
  var field = u.findWhere(fields, {label: fieldLabel});
  if(!field)
    return false;

  field.value = new Buffer(value);

  return true;
};


// Export message id and class seperately
exports.MESSAGE_ID = 0x00;
exports.class = BaseMessage;
