exports.parseValue = function(value) {
  value = value.readInt32LE(0);
  return value / 1000000.0;
};

exports.toString = function(value) {
  value = value.readInt32LE(0);
  return (value / 1000000.0).toString();
};

exports.toBytes = function(value) {
  return value;
};
