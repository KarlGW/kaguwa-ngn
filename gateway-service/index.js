'use strict';

var server = require('./server/server'),
  config = require('./config/config'),
  helpers = require('./lib/helpers');

console.log('--- Gateway Service ---');
console.log('--- Testing Connection to Dependent Services ---');
console.log('');

process.on('uncaughtException', function (err) {
  console.error('Unhandled Exception', err);
});

process.on('unhandledRejection', function (err) {
  console.error('Unhandled Rejection', err);
});

helpers.testServiceConnections(config.services).then(result => {
  if (result === false) {
    server.start(config);
  }
});