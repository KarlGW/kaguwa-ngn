'use strict';

var express = require('express');
var AuthController = require('../controllers/auth-controller');

var router = express.Router();

module.exports = (options) => {

  var authController = new AuthController(options);

  router.get('/', (req, res) => {
    res.status(200).json({});
  })

  router.post('/authenticate', authController.authenticate.bind(authController));

  router.post('/authorize', authController.authorize.bind(authController));

  return router;
};