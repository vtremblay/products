'use strict';

class ProductMapper {
  map(product) {
    if (Array.isArray(product)) {
      return Array.from(product, this._doMap);
    }
    return this._doMap(product);
  }

  _doMap(product) {
    return {
      code: product.code,
      description: product.description,
      lang: product.lang,
      type: product.type
    }
  }
}

module.exports = ProductMapper;