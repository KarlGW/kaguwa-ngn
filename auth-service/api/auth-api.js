'use strict';

var express = require('express');
var AuthController = require('../controllers/auth-controller');

var router = express.Router();

module.exports = function (options) {

  var authController = new AuthController(options);

  // Add routes.
  router.post('/authenticate', authController.authenticate.bind());

  return router;
};