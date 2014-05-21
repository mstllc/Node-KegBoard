var util = require('util');
var BaseMessage = require('./BaseMessage.js').class;
var StringField = require('../fields/StringField.js');
var Uint16Field = require('../fields/Uint16Field.js');

/**
 * Main ConfigurationMessage definition.
 * @constructor
 * @param {Buffer} payload - Buffer containing message payload
 */
var ConfigurationMessage = function(payload) {
  BaseMessage.call(this);

  this.id = 0x02;
  this.name = 'ConfigurationMessage';
  this.fields = {
    0x01: {
      label: 'board_name',
      format: StringField
    },
    0x02: {
      label: 'baud_rate',
      format: Uint16Field
    },
    0x03: {
      label: 'update_interval',
      format: Uint16Field
    }
  };

  this._unpackFromPayload(payload);
};

// Inherit BaseMessage prototypes
util.inherits(ConfigurationMessage, BaseMessage);

// Export message id and class seperately
exports.MESSAGE_ID = 0x02;
exports.class = ConfigurationMessage;
