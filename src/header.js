'use strict';

module.exports = function(env){
  
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

  // construct importance erp with same distribution type as original erp
  function withImportanceParams(s, k, a, erp, importanceParams){
    var newERP = _.clone(erp);
    var importanceERP = _.clone(erp);
    importanceERP.sample = function(params){
      return erp.sample(importanceParams);
    };
    importanceERP.score = function(params, val){
      return erp.score(importanceParams, val);
    };
    newERP.importanceERP = importanceERP;
    return k(s, newERP);
  }

  return {
    getAddress: getAddress,
    relativizeAddress: relativizeAddress,
    withImportanceParams: withImportanceParams
  };

};
