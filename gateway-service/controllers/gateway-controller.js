'use strict';

class GatewayController {

  constructor(options) {
    this.options || {};
  }

  listRoutes(req, res) {
    res.json([
      'Authentication: /authenticate',
    ]);
  }
}

module.exports = GatewayController;
