var Uint32Field = function(value) {
  return value.readUInt32LE(0);
};

module.exports = Uint32Field;
