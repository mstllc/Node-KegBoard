var util = require('util');
var BaseMessage = require('./BaseMessage.js').class;
var StringField = require('../fields/StringField.js');

/**
 * Main SetSerialNumberCommand definition.
 * @constructor
 */
var SetSerialNumberCommand = function() {
  BaseMessage.call(this);

  this.id = 0x85;
  this.name = 'SetSerialNumberCommand';
  this.fields = {
    0x01: {
      label: 'serial_number',
      format: StringField
    }
  };
};

// Inherit BaseMessage prototypes
util.inherits(SetSerialNumberCommand, BaseMessage);

// Export message id and class seperately
exports.MESSAGE_ID = 0x85;
exports.class = SetSerialNumberCommand;
