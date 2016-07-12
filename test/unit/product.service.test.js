'use strict';

const assert = require('assert');
const sinon = require('sinon');
const soajs = require('soajs');
const expect = require("chai").use(require('sinon-chai')).expect;

const ProductService = require('../../service/product.service');

describe('Product Service', function () {

  let productService = new ProductService();
  let mongo;
  let soajsMongo;

  let product = {
    code: 'AAAA',
    description: 'desc',
    lang: 'en',
    type: 'VP'
  };

  beforeEach(function (done) {
    soajsMongo = sinon.createStubInstance(soajs.mongo);
    mongo = sinon.stub(productService, '_mongo', function () { return soajsMongo; });
    done();
  });

  afterEach(function (done) {
    mongo.restore();
    done();
  });

  describe('create', function () {
    it('Should return a 409 error when product code is already existing', function (done) {

      soajsMongo.find.yields(null, [ product ]);

      productService.create(product, {}, function (error) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(error).to.not.be.null;
        expect(error.code).to.equal(409);
        done();
      });
    });

    it('Should return a 500 error when there is an issue while searching for existing product', function (done) {

      soajsMongo.find.yields({}, [ product ]);

      productService.create(product, {}, function (error) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(error).to.not.be.null;
        expect(error.code).to.equal(500);
        done();
      });
    });

    it('Should return a 500 error when there is an issue while inserting the product', function (done) {

      soajsMongo.find.yields(null, []);
      soajsMongo.insert.yields({}, []);

      productService.create(product, {}, function (error) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(soajsMongo.insert).calledWith('product', product);
        expect(error).to.not.be.null;
        expect(error.code).to.equal(500);
        done();
      });
    });

    it('Should return the newly created product on success', function (done) {

      soajsMongo.find.yields(null, []);
      soajsMongo.insert.yields(null, [ product ]);

      productService.create(product, {}, function (error, created) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(soajsMongo.insert).calledWith('product', product);
        expect(error).to.be.null;
        expect(created).to.deep.equal(product);
        done();
      });
    });
  });

  describe('findByCode', function () {
    it('Should return a 500 error when there is an issue while fetching the product', function (done) {

      soajsMongo.find.yields({}, []);

      productService.findByCode(product.code, {}, function (error) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(error).to.not.be.null;
        expect(error.code).to.equal(500);
        done();
      });
    });

    it('Should return null result when there is no product found', function (done) {

      soajsMongo.find.yields(null, []);

      productService.findByCode(product.code, {}, function (error, data) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(error).to.be.null;
        expect(data).to.be.null;
        done();
      });
    });

    it('Should return the requested product', function (done) {

      soajsMongo.find.yields(null, [ product ]);

      productService.findByCode(product.code, {}, function (error, data) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(error).to.be.null;
        expect(data).to.deep.equal(product);
        done();
      });
    });
  });

  describe('findByTypes', function () {
    it('Should return a 500 error when there is an issue while fetching the product', function (done) {

      soajsMongo.find.yields({}, []);

      productService.findByTypes([ 'VP' ], {}, function (error) {
        expect(soajsMongo.find).calledWith('product', { 'type': { '$in': [ 'VP' ] } }, {});
        expect(error).to.not.be.null;
        expect(error.code).to.equal(500);
        done();
      });
    });

    it('Should return null result when there is no product found', function (done) {

      soajsMongo.find.yields(null, []);

      productService.findByTypes([ 'VP' ], {}, function (error, data) {
        expect(soajsMongo.find).calledWith('product', { 'type': { '$in': [ 'VP' ] } }, {});
        expect(error).to.be.null;
        expect(data).to.be.an.array;
        expect(data).to.be.empty;
        done();
      });
    });

    it('Should return the requested products', function (done) {

      soajsMongo.find.yields(null, [ product ]);

      productService.findByTypes([ 'VP', 'OTHER' ], {}, function (error, data) {
        expect(soajsMongo.find).calledWith('product', { 'type': { '$in': [ 'VP', 'OTHER' ] } }, {});
        expect(error).to.be.null;
        expect(data).to.be.an.array;
        expect(data).to.have.lengthOf(1);
        expect(data).to.deep.include.members([ product ]);
        done();
      });
    });

    it('Should return all products when no types are specified', function (done) {

      soajsMongo.find.yields(null, [ product ]);

      productService.findByTypes(null, {}, function (error, data) {
        expect(soajsMongo.find).calledWith('product', {}, {});
        expect(error).to.be.null;
        expect(data).to.be.an.array;
        expect(data).to.have.lengthOf(1);
        expect(data).to.deep.include.members([ product ]);
        done();
      });
    });
  });

  describe('update', function () {
    it('Should return a 404 error when product does not exists', function (done) {

      soajsMongo.find.yields(null, []);

      productService.update(product.code, product, {}, function (error) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(error).to.not.be.null;
        expect(error.code).to.equal(404);
        done();
      });
    });

    it('Should return a 500 error when there is an issue while searching for existing product', function (done) {

      soajsMongo.find.yields({}, []);

      productService.update(product.code, product, {}, function (error) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(error).to.not.be.null;
        expect(error.code).to.be.equal(500);
        done();
      });
    });

    it('Should return a 500 error when there is an issue while updating the product', function (done) {

      soajsMongo.find.yields(null, [ product ]);
      soajsMongo.update.yields({}, []);

      productService.update(product.code, product, {}, function (error) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(soajsMongo.update).calledWith('product', { 'code': { '$eq': product.code } }, product);
        expect(error).to.not.be.null;
        expect(error.code).to.equal(500);
        done();
      });
    });

    it('Should return the updated product on success', function (done) {

      soajsMongo.find.yields(null, [ product ]);
      soajsMongo.update.yields(null, [ product ]);

      productService.update(product.code, product, {}, function (error, updated) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(soajsMongo.update).calledWith('product', { 'code': { '$eq': product.code } }, product);
        expect(error).to.be.null;
        expect(updated).to.deep.equal(product);
        done();
      });
    });
  });

  describe('delete', function () {
    it('Should return a 404 error when product does not exists', function (done) {

      soajsMongo.find.yields(null, []);

      productService.delete(product.code, {}, function (error) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(error).to.not.be.null;
        expect(error.code).to.equal(404);
        done();
      });
    });

    it('Should return a 500 error when there is an issue while searching for existing product', function (done) {

      soajsMongo.find.yields({}, []);

      productService.delete(product.code, {}, function (error) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(error).to.not.be.null;
        expect(error.code).to.be.equal(500);
        done();
      });
    });

    it('Should return a 500 error when there is an issue while deleting the product', function (done) {

      soajsMongo.find.yields(null, [ product ]);
      soajsMongo.remove.yields({}, []);

      productService.delete(product.code, {}, function (error) {
        expect(soajsMongo.find).calledWith('product', { 'code': { '$eq': product.code } }, {});
        expect(soajsMongo.remove).calledWith('product', { 'code': { '$eq': product.code } });
        expect(error).to.not.be.null;
        expect(error.code).to.equal(500);
        done();
      });
    });
  });
});