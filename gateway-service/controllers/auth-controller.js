'use strict';

var request = require('request');

class AuthController {
  constructor(options) {
    this.baseUri = options.baseUri.replace(/\/$/, "");
  }

  authenticate(req, res) {

    var url = this.baseUri + '/authenticate';

    var credential = { username: req.body.username, password: req.body.password };

    request.post({ url: url, form: credential }, (err, httpResponse, body) => {
      var jsonResponse = JSON.parse(body);

      res.status(httpResponse.statusCode).json(jsonResponse);
    })
  }
}

module.exports = AuthController;
