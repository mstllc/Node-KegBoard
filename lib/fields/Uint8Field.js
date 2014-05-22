exports.parseValue = function(value) {
  return value.readUInt8(0);
};

exports.toString = function(value) {
  return value.readUInt8(0).toString();
};

exports.toBytes = function(value) {
  return value;
};
