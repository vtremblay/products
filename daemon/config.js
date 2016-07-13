'use strict';

module.exports = {
  serviceName: "ProductsDaemon",
  servicePort: 4056,
  type: 'daemon',
  serviceVersion: 1,
  prerequisites: {},
  "errors": {},
  "waitTimeInMin": 1 * 60,
  "schema": {
    "createSubOrders": {
      "l": "Create SubOrders"
    }
  }
};