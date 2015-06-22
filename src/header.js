'use strict';

var removeCommonPrefix = function(xs, ys){
  if ((xs.length === 0) || (ys.length === 0)) {
    return [xs, ys];
  } else if (xs[0] === ys[0]){
    return removeCommonPrefix(xs.slice(1), ys.slice(1));
  } else {
    return [xs, ys];
  }
};

function parseAddress(address){
  // address starts with '_', so slice of first element
  var addressArray = address.split("_").slice(1);
  for (var i=0; i<addressArray.length; i++){
    addressArray[i] = parseInt(addressArray[i], 10);
  }
  return addressArray;
}

function relativizeAddress(s, k, a, base, address){
  var parsedBase = parseAddress(base);
  var parsedAddress = parseAddress(address);
  var tmp = removeCommonPrefix(parsedBase, parsedAddress);
  var shortBase = tmp[0];
  var shortAddress = tmp[1];
  if (shortBase.length != 1){
    console.log('Base:', base);
    console.log('Address:', address);
    console.log('shortBase:', shortBase);
  }
  assert.equal(shortBase.length, 1);
  var initAddressCounter = shortBase[0];
  var relativizedArray = shortAddress.map(
    function(i){return i-initAddressCounter;}
  );
  var relativizedAddress = '_' + relativizedArray.join('_');
  return k(s, relativizedAddress);
}

function getAddress(s, k, a){
  return k(s, a);
}

module.exports = {
  getAddress: getAddress,
  relativizeAddress: relativizeAddress
};
