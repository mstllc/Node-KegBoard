exports.parseValue = function(value) {
  return value.readUInt16LE(0);
};

exports.toBytes = function(value) {
  return value;
};
