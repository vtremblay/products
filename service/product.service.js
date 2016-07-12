'use strict';

const soajs = require('soajs');

const ProductMapper = require('./product.mapper');

const collection = 'product';

class ProductService {

  constructor () {
    this.mapper = new ProductMapper();
  }

  findByTypes (types, registry, callback) {
    let query = types ? { 'type': { '$in': types } } : {};

    this._mongo(registry).find(collection, query, {}, (error, data) => {
      this._handleCallback(error, callback, data);
    });
  }

  findByCode (code, registry, callback) {
    this._mongo(registry).find(collection, { 'code': { '$eq': code } }, {}, (error, data) => {
      this._handleCallback(error, callback, data.length == 0 ? null : data[ 0 ]);
    });
  }

  create (product, registry, callback) {
    this.findByCode(product.code, registry, (error, data) => {
      if (error) {
        return callback(error);
      }

      if (data) {
        return callback({ code: 409, msg: `Product [${product.code}] already exists` });
      }

      this._mongo(registry).insert(collection, product, (error, data) => {
        this._handleCallback(error, callback, data[ 0 ]);
      });
    });
  }

  update (code, product, registry, callback) {
    this.findByCode(product.code, registry, (error, data) => {
      if (error) {
        return callback(error);
      }

      if (!data) {
        return callback({ code: 404, msg: `Product [${product.code}] not found` });
      }
      
      this._mongo(registry).update(collection, { 'code': { '$eq': code } }, product, (error, data) => {
        this._handleCallback(error, callback, data[ 0 ]);
      });
    });
  }

  delete (code, registry, callback) {
    this.findByCode(code, registry, (error, data) => {
      if (error) {
        return callback(error);
      }

      if (!data) {
        callback({ code: 404, msg: `Product [${code}] not found` });
      }
      
      this._mongo(registry).remove(collection, { 'code': { '$eq': code } }, (error) => {
        this._handleCallback(error, callback);
      });
    });
  }

  _mongo (registry) {
    return new soajs.mongo(registry.coreDB.product);
  }

  _handleCallback (error, callback, data) {
    if (error) {
      console.error(error);
      callback({ code: 500, msg: "Internal Error" }, null);
    } else {
      callback(null, data ? this.mapper.map(data) : null);
    }
  }
}

module.exports = ProductService;
