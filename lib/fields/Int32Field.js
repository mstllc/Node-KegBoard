exports.parseValue = function(value) {
  return value.readInt32LE(0);
};

exports.toBytes = function(value) {
  return value;
};
