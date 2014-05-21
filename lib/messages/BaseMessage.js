var bufferpack = require('bufferpack');

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
    this.fields[tagLen[0]].value = this.fields[tagLen[0]].format(data);
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
      fieldStr += ' ' + fields[key].label + '=' + fields[key].value;
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
      fieldObj[fields[key].label] = fieldObj[fields[key].value];
    }
  });
  return {id: this.id, name: this.name, fields: fieldObj};
};


// Export message id and class seperately
exports.MESSAGE_ID = 0x00;
exports.class = BaseMessage;
