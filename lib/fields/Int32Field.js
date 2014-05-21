var Int32Field = function(value) {
  return value.readInt32LE(0);
};

module.exports = Int32Field;
