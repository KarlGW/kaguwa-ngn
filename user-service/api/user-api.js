'use strict';

var express = require('express');
var UserController = require('../controllers/user-controller');
var middleware = require('./middleware');

var router = express.Router();

module.exports = (options) => {

  var userController = new UserController(options.repository);

  router.get('/', (req, res) => {
    res.status(200).json({});
  });

  router.get('/users', userController.list.bind(userController));

  router.get('/users/:id', userController.getUserById.bind(userController));

  router.post('/users', userController.add.bind(userController));

  router.put('/users/:id', userController.update.bind(userController));

  router.delete('/users/:id', userController.delete.bind(userController));

  router.get('/users/name/:username', userController.getUserByName.bind(userController));

  router.post('/users/authenticate', userController.authenticate.bind(userController));

  return router;
};