var util = require('util');
var BaseMessage = require('./BaseMessage.js').class;
var StringField = require('../fields/StringField.js');
var TempField = require('../fields/TempField.js');

/**
 * Main TemperatureReadingMessage definition.
 * @constructor
 * @param {Buffer} payload - Buffer containing message payload
 */
var TemperatureReadingMessage = function(payload) {
  BaseMessage.call(this);

  this.id = 0x11;
  this.name = 'TemperatureReadingMessage';
  this.fields = {
    0x01: {
      label: 'sensor_name',
      format: StringField
    },
    0x02: {
      label: 'sensor_reading',
      format: TempField
    }
  };

  this._unpackFromPayload(payload);
};

// Inherit BaseMessage prototypes
util.inherits(TemperatureReadingMessage, BaseMessage);

// Export message id and class seperately
exports.MESSAGE_ID = 0x11;
exports.class = TemperatureReadingMessage;
