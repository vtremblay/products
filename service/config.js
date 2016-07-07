const product = require('./schema/product');

module.exports = {
  type: 'service',
  prerequisites: {
    cpu: '',
    memory: ''
  },
  serviceName: 'Products',
  serviceGroup: 'Referential Data',
  serviceVersion: 1,
  servicePort: 4055,
  extKeyRequired: false,
  'errors': {},
  'schema': {
    'commonFields': {
      'code': {
        'source': [ 'params.code' ],
        'required': true,
        'validation': {
          'type': 'string',
          'format': 'alphanumeric'
        }
      },
      'product': {
        'source': [ 'body.product' ],
        'required': true,
        'validation': {
          'type': 'object',
          'properties': product
        }
      }
    },
    'get': {
      '/products': {
        '_apiInfo': {
          'l': 'Search Products'
        },
        'types': {
          'source': [ 'query.type' ],
          'validation': {
            'type': 'array',
            'items': {
              'type': 'string'
            },
            'minItems': 0
          }
        }
      },
      '/products/:code': {
        '_apiInfo': {
          'l': 'Get Products'
        },
        'commonFields': [ 'code' ]
      }
    },
    'post': {
      '/products': {
        '_apiInfo': {
          'l': 'Create Product'
        },
        'commonFields': [ 'product' ]
      }
    },
    'put': {
      '/products/:code': {
        '_apiInfo': {
          'l': 'Update Product'
        },
        'commonFields': [ 'code', 'product' ]
      }
    },
    'delete': {
      '/products/:code': {
        '_apiInfo': {
          'l': 'Delete Product'
        },
        'commonFields': [ 'code' ]
      }
    }
  }
};