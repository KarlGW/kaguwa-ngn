'use strict';

var auth = require('../lib/auth');

class AuthController {

  constructor(options) {
    this.uri = options.uri || null
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
    //var credential = { username: 'karlw', password: '12345' };
    var credential = { username: req.body.username, password: req.body.password };
    var uri = 'http://localhost:3000/api/users/authenticate';
    
    auth.authenticate(uri, credential, function (err, user) {
      if (err) return res.status(500).json({ message: 'Error', code: 500 });

      if (user) {
        
        var token = auth.generateToken(user);
        
        var tokenResponse = {
          token: token
        };

        res.status(200).json(tokenResponse);
      } else {
        res.status(401).json({ message: 'Authentication failed', code: 401 });
      }
    });
  }

  authorize() {

  }
}

module.exports = AuthController;