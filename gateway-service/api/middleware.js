'use strict';

var request = require('request');
var config = require('../config/config');

module.exports.verifyToken = (req, res, next) => {
  
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
  var responseBody;

  if (token) {

    var uri = config.services.authService.baseUri + '/authorize';
    
    request.post({url: uri, form: { token: token } }, (err, httpResponse, body ) => {
      if (err) return res.status(403).json({ error: 403, message: 'Failed to authenticate.' });
      
      res.groups = JSON.parse(httpResponse.body).data;
      next();
    });
  } else {
    return res.status(403).json({ error: 403, message: 'Failed to authenticate. No token provided.'})
  }
};

module.exports.isWriter = (req, res, next) => {

  if (res.groups.includes(config.roles.readwrite)) { 
    next();
  } else {
    return res.status(403).json({ error: 403, message: 'Not sufficient premissions.' });
  }
};
