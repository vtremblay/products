var soajs = require("soajs");
var config = require("./config");

var daemon = new soajs.server.daemon({"config": config});

daemon.init(function () {

  daemon.job('synchronizeProducts', function (soajs, next) {
    next();
  });

  daemon.start();
});