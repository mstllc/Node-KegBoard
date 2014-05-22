exports.parseValue = function(value) {
  return value.readInt32LE(0);
};

exports.toString = function(value) {
  return value.readInt32LE(0).toString();
};

exports.toBytes = function(value) {
  return value;
};
