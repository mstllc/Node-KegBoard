exports.parseValue = function(value) {
  return value.readUInt32LE(0);
};

exports.toBytes = function(value) {
  return value;
};
