var jwt = require('jsonwebtoken'),
  request = require('request'),
  config = require('../config/config');

module.exports.verifyToken = function (token, callback) {

  var tokenSecret = "";
  var error = null;

  if (token) {
    jwt.verify(token, tokenSecret, function (err, decoded) {
      if (err) {
        error = new Error('Could not be verified');
        error.code = 1001;

        return error;
      } else {
        callback(decoded);
      }
    });
  } else {
    error = new Error('No token provided');
    error.code = 1000;
  }
};

module.exports.generateToken = function (user) {
  var payload = {
    id: user._id,
    username: user.username,
    groups: user.groups,
  };

  var token = jwt.sign(payload, config.token.secret, { expiresIn: '24h'});

  return token;
};

module.exports.authenticate = function (uri, credential, callback) {
  // See if user exists.
  request.post({url: uri, form: credential }, function (err, httpResponse, body) {
    if (err) return callback(err);
    
    var jsonResponse = JSON.parse(body);
    callback(null, jsonResponse);
  });
};