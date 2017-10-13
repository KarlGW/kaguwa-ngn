'use strict';

var server = require('./server/server');
var UserRepository = require('./repository/user-repository');
var User = require('./models/user-model');
var config = require('./config/config');

var repository;

// Logging for starting.
console.log('--- User Service ---');
console.log('--- Connecting to User Repository ---');
console.log('');

process.on('uncaughtException', function (err) {
  console.error('Unhandled Exception', err);
});

process.on('unhandledRejection', function (err) {
  console.error('Unhandled Rejection', err);
});

var options = { 
  connectionSettings: {
    uri: config.db.uri,
    options: config.db.options
  },
  model: User, 
}

UserRepository.connect(options, function (repo) {
  config.server.repository = repo;
  server.start(config.server);
});