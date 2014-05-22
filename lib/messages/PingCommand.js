var util = require('util');
var BaseMessage = require('./BaseMessage.js').class;

/**
 * Main PingCommand definition.
 * @constructor
 */
var PingCommand = function() {
  BaseMessage.call(this);

  this.id = 0x81;
  this.name = 'PingCommand';
};

// Inherit BaseMessage prototypes
util.inherits(PingCommand, BaseMessage);

// Export message id and class seperately
exports.MESSAGE_ID = 0x81;
exports.class = PingCommand;
