var jwt = require('jsonwebtoken');

class TokenHandler {
  constructor(options) {
    this.options = options || {}
  }

  decodeToken(token, callback) {
    
    var tokenSecret = 'longasssecret';
    //var tokenSecret = this.options.secret;

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
}

module.exports = function (secret) {
  return new TokenHandler(secret);
};
