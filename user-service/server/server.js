'use strict';

const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const utils = require('./utils');

module.exports.start = (options) => {

  var app = express();
  // Configure and add settings to server.
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ 'extended': 'true' }));
  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: 'application/*+json' }));
  app.use(methodOverride('X-HTTP-Method-Override'));
  app.disable('x-powered-by');
  // Set api.
  var api = require('../api/user-api')(options);

  app.use('/api', api);

  var server = http.createServer(app);

  utils.createShutdownHooks(server, options.repository);

  server.listen(options.port, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('App listening on port: ', options.port);
  });
};