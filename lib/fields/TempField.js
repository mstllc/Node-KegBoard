var TempField = function(value) {
  value = value.readInt32LE(0);
  return value / 1000000.0;
};

module.exports = TempField;
