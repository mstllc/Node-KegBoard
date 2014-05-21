var util = require('util');
var BaseMessage = require('./BaseMessage.js').class;
var StringField = require('../fields/StringField.js');

/**
 * Main OutputStatusMessage definition.
 * @constructor
 * @param {Buffer} payload - Buffer containing message payload
 */
var OutputStatusMessage = function(payload) {
  BaseMessage.call(this);

  this.id = 0x12;
  this.name = 'OutputStatusMessage';
  this.fields = {
    0x01: {
      label: 'output_name',
      format: StringField
    },
    0x02: {
      label: 'output_reading',
      format: OutputField
    }
  };

  this._unpackFromPayload(payload);
};

// Inherit BaseMessage prototypes
util.inherits(OutputStatusMessage, BaseMessage);

// Export message id and class seperately
exports.MESSAGE_ID = 0x12;
exports.class = OutputStatusMessage;
