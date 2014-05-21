var util = require('util');
var BaseMessage = require('./BaseMessage.js').class;
var StringField = require('../fields/StringField.js');
var Uint16Field = require('../fields/Uint16Field.js');
var Uint32Field = require('../fields/Uint32Field.js');

/**
 * Main HelloMessage definition.
 * @constructor
 * @param {Buffer} payload - Buffer containing message payload
 */
var HelloMessage = function(payload) {
  BaseMessage.call(this);

  this.id = 0x01;
  this.name = 'HelloMessage';
  this.fields = {
    0x01: {
      label: 'firmware_version',
      format: Uint16Field
    },
    0x02: {
      label: 'protocol_version',
      format: Uint16Field
    },
    0x03: {
      label: 'serial_number',
      format: StringField
    },
    0x04: {
      label: 'uptime_millis',
      format: Uint32Field
    },
    0x05: {
      label: 'uptime_days',
      format: Uint32Field
    }
  };

  this._unpackFromPayload(payload);
};

// Inherit BaseMessage prototypes
util.inherits(HelloMessage, BaseMessage);

// Export message id and class seperately
exports.MESSAGE_ID = 0x01;
exports.class = HelloMessage;
