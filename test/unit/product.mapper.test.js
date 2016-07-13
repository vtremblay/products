'use strict';

const assert = require('assert');
const sinon = require('sinon');
const soajs = require('soajs');
const expect = require("chai").use(require('sinon-chai')).expect;

const ProductMapper = require('../../service/product.mapper');

describe('Product Mapper', function () {

  let mapper = new ProductMapper();

  describe('map', function () {
    it('Should remove the _id attribute', function () {

      let original = {
        _id: '4156465465465',
        code: 'AAAA',
        description: 'desc',
        lang: 'en',
        type: 'VP'
      };

      let mapped = mapper.map(original);

      expect(mapped).to.deep.equal({
        code: 'AAAA',
        description: 'desc',
        lang: 'en',
        type: 'VP'
      });
    });

    it('Should remove the _id attribute for all element of an array', function () {

      let original = {
        _id: '4156465465465',
        code: 'AAAA',
        description: 'desc',
        lang: 'en',
        type: 'VP'
      };

      let expected = {
        code: 'AAAA',
        description: 'desc',
        lang: 'en',
        type: 'VP'
      };

      let mapped = mapper.map([original, original]);

      expect(mapped).to.deep.include.members([expected, expected]);
    });
  });
});