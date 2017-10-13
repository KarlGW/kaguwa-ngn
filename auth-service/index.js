'use strict';

var server = require('./server/server'),
  config = require('./config/config'),
  request = require('request');

console.log('--- Auth Service ---');
console.log('--- Testing Connection to User Service ---');
console.log('');

process.on('uncaughtException', function (err) {
  console.error('Unhandled Exception', err);
});

process.on('unhandledRejection', function (err) {
  console.error('Unhandled Rejection', err);
});

request.get(config.userService.uri, function (err, httpResponse, body) {
  if (err) {
    console.log('FAIL: Could not connect to User Service.')
    return;
  } 

  if (httpResponse.statusCode === 200) {
    console.log('--- Connection to User Service successfull ---')
    console.log('');
    server.start(config);
  }
});
