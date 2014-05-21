// Require KegBoard module
var kegboard = require('../lib/kegboard.js');

// Check for connected KegBoard
console.log('Looking for KegBoard...');
kegboard.checkForKegboard(function(err, board) {
  if(err) {
    console.log('Error finding KegBoard', err);
    return false;
  } else {
    console.log('Found: %s', board.toString());
    console.log('Listening to KegBoard...');

    // Board 'open' method must be called to send or receive messages
    board.open(function() {

      // Listen for messages
      board.on('message', function(message) {
        console.log(message.toString());
      });

    });
  }
});
