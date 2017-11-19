'use strict';

var auth = require('../lib/auth');
var TokenHandler = require('../lib/token-handler');

class AuthController {

  constructor(options) {
    this.uri = options.userService.uri;
    this.tokenHandler = new TokenHandler(options.token.secret);
  }

  /**
   * 
   * Authenticates a user.
   * 
   * @param {object} req
   * @param {object} res
   */
  authenticate(req, res) {
    // Temp
    var credential = { username: req.body.username, password: req.body.password };
    var uri = this.uri + '/users/authenticate';

    var self = this;
    
    auth.authenticate(uri, credential, (err, user) => {
      if (err) return res.status(500).json({ message: 'Error', code: 500 });

      if (user) {
        
        var token = self.tokenHandler.generateToken(user);
        
        var tokenResponse = {
          token: token
        };

        res.status(200).json(tokenResponse);
      } else {
        res.status(401).json({ message: 'Authentication failed', code: 401 });
      }
    });
  }

  authorize(req, res) {

    this.tokenHandler.verifyToken(req.body.token, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Could not authorize.', code: 403 });

      res.status(200).json({ data: decoded.groups});
    });
  }
}

module.exports = AuthController;