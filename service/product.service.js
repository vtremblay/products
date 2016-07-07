'use strict';

const soajs = require('soajs');

const collection = 'product';

class ProductService {

  findByTypes (types, registry, callback) {
    let mongo = new soajs.mongo(registry.coreDB.product);

    let query = types ? { 'type': { '$in': types } } : {};
    mongo.find(collection, query, {}, function (err, data) {
      callback(err, data);
    });
  }

  findById (code, registry, callback) {
    let mongo = new soajs.mongo(registry.coreDB.product);

    let query = { 'code': { '$eq': code } };
    mongo.find(collection, query, {}, function (err, data) {
      callback(err, data);
    });
  }

  create (product, registry, callback) {
    let mongo = new soajs.mongo(registry.coreDB.product);

    mongo.insert(collection, product, function (err, data) {
      callback(err, data);
    });
  }

  update (code, product, registry, callback) {
    let mongo = new soajs.mongo(registry.coreDB.product);

    let query = { 'code': { '$eq': code } };
    mongo.update(collection, query, product, function (err, data) {
      callback(err, data);
    });
  }

  delete (code, registry, callback) {
    let mongo = new soajs.mongo(registry.coreDB.product);

    let query = { 'code': { '$eq': code } };
    mongo.remove(collection, query, function (err, data) {
      callback(err, {});
    });
  }
}

module.exports = ProductService;
