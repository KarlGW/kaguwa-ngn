'use strict';

var jwt = require('jsonwebtoken');

class TokenHandler {
  constructor(secret) {
    this.secret = secret || null;
  }

  verifyToken(token, callback) {
    
    
    var tokenSecret = this.secret;

    if (token) {
      jwt.verify(token, tokenSecret, (err, decoded) => {
        if (err) {
          var error = new Error('Could not verify token.');
          error.code = 1001;

          return callback(error);
        } else {
          return callback(null, decoded);
        }
      });
    } else {
      var error = new Error('No token provided.');
      error.code = 1000;

      return callback(error);
    }
  }

  generateToken(user) {
    var payload = {
      id: user._id,
      username: user.username,
      groups: user.groups,
    };
  
    var token = jwt.sign(payload, this.secret, { expiresIn: '24h'});
  
    return token;
  }
}

module.exports = TokenHandler;