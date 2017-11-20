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

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection', err.message);
});

var options = { 
  connectionSettings: {
    uri: config.db.uri,
    options: config.db.options
  },
  model: User, 
}

UserRepository.connect(options, (repo) => {
  config.server.repository = repo;
  server.start(config.server);
});