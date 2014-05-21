var util = require('util');
var BaseMessage = require('./BaseMessage.js').class;
var StringField = require('../fields/StringField.js');
var Uint32Field = require('../fields/Uint32Field.js');

/**
 * Main MeterStatusMessage definition.
 * @constructor
 * @param {Buffer} payload - Buffer containing message payload
 */
var MeterStatusMessage = function(payload) {
  BaseMessage.call(this);

  this.id = 0x10;
  this.name = 'MeterStatusMessage';
  this.fields = {
    0x01: {
      label: 'meter_name',
      format: StringField
    },
    0x02: {
      label: 'meter_reading',
      format: Uint32Field
    }
  };

  this._unpackFromPayload(payload);
};

// Inherit BaseMessage prototypes
util.inherits(MeterStatusMessage, BaseMessage);

// Export message id and class seperately
exports.MESSAGE_ID = 0x10;
exports.class = MeterStatusMessage;
