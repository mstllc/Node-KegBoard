var util = require('util');
var BaseMessage = require('./BaseMessage.js').class;
var Uint8Field = require('../fields/Uint8Field.js');
var OutputField = require('../fields/OutputField.js');

/**
 * Main SetOutputCommand definition.
 * @constructor
 */
var SetOutputCommand = function() {
  BaseMessage.call(this);

  this.id = 0x84;
  this.name = 'SetOutputCommand';
  this.fields = {
    0x01: {
      label: 'output_id',
      format: Uint8Field
    },
    0x02: {
      label: 'output_mode',
      format: OutputField
    }
  };
};

// Inherit BaseMessage prototypes
util.inherits(SetOutputCommand, BaseMessage);

// Export message id and class seperately
exports.MESSAGE_ID = 0x84;
exports.class = SetOutputCommand;
