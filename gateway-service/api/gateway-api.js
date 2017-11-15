'use strict';

var express = require('express');
var router = express.Router();

var middleware = require('./middleware');
var GatewayController = require('../controllers/gateway-controller');
var AuthController = require('../controllers/auth-controller');

module.exports = function (options) {
  
  var gatewayController = new GatewayController();
  var authController = new AuthController(options.services.authService);

  // Add routes.

  // Default route.
  router.get('/', middleware.verifyToken, middleware.isWriter, gatewayController.listRoutes.bind(gatewayController));

  // Authentication routes.
  router.post('/authenticate', authController.authenticate.bind(authController));

  return router;
};
