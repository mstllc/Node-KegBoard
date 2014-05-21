var util = require('util');
var BaseMessage = require('./BaseMessage.js').class;
var StringField = require('../fields/StringField.js');
var Uint8Field = require('../fields/Uint8Field.js');

/**
 * Main AuthTokenMessage definition.
 * @constructor
 * @param {Buffer} payload - Buffer containing message payload
 */
var AuthTokenMessage = function(payload) {
  BaseMessage.call(this);

  this.id = 0x14;
  this.name = 'AuthTokenMessage';
  this.fields = {
    0x01: {
      label: 'device',
      format: StringField
    },
    0x02: {
      label: 'token',
      format: BytesField
    },
    0x03: {
      label: 'status',
      format: Uint8Field
    }
  };

  this._unpackFromPayload(payload);
};

// Inherit BaseMessage prototypes
util.inherits(AuthTokenMessage, BaseMessage);

// Export message id and class seperately
exports.MESSAGE_ID = 0x14;
exports.class = AuthTokenMessage;
