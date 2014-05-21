exports.parseValue = function(value) {
  return value.readUInt8(0);
};

exports.toBytes = function(value) {
  return value;
};
