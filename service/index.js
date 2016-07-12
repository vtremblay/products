'use strict';

const soajs = require('soajs');
const config = require('./config.js');
const server = new soajs.server.service(config);

const ProductService = require('./product.service');
const productService = new ProductService();

const callback = function (req, res) {
  return function (error, data) {
    res.json(req.soajs.buildResponse(error, data));
  }
};

server.init(function () {
  server.get('/products', function (req, res) {
    productService.findByTypes(req.soajs.inputmaskData.types, req.soajs.registry, callback(req, res));
  });
  server.get('/products/:code', function (req, res) {
    productService.findByCode(req.soajs.inputmaskData.code, req.soajs.registry, callback(req, res));
  });
  server.post('/products', function (req, res) {
    productService.create(req.soajs.inputmaskData.product, req.soajs.registry, callback(req, res));
  });
  server.put('/products/:code', function (req, res) {
    productService.update(req.soajs.inputmaskData.code, req.soajs.inputmaskData.product, req.soajs.registry, callback(req, res))
  });
  server.delete('/products/:code', function (req, res) {
    productService.delete(req.soajs.inputmaskData.code, callback(req, res))
  });
  server.start();
});
