'use strict';

const server = require('./server/server');
const UserRepository = require('./repository/user-repository');
const User = require('./models/user-model');
const config = require('./config/config');
const utils = require('./server/utils');

let repository;

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