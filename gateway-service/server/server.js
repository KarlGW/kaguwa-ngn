'use strict';

var express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override');

module.exports.start = function (options) {

  var app = express();
  // Configure and add settings to server.
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ 'extended': 'true' }));
  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: 'application/*+json' }));
  app.use(methodOverride('X-HTTP-Method-Override'));
  app.disable('x-powered-by');
  // Set api.
  var api = require('../api/gateway-api')(options);

  app.use('/api', api);

  console.log('App listening on port: ', options.server.port);
  var server =  app.listen(options.server.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.log('App started.');
  });
};