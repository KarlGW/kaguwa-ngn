'use strict';

process.env.NODE_ENV = 'test';

var should = require('should');
var sinon = require('sinon');
var AuthController = require('../controllers/auth-controller');

describe('AuthController', () => {

  options = { uri: 'http://localhost' };

  var authController = new AuthController(options);

});