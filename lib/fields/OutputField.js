exports.parseValue = function(value) {
  return value.readUInt16LE(0);
};

exports.toString = function(value) {
  value =  value.readUInt16LE(0);
  if(value) {
    return 'on';
  } else {
    return 'off';
  }
};

exports.toBytes = function(value) {
  return value;
};
