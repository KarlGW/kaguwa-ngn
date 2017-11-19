'use strict';

var utils = require('./utils');

class UserController {

  constructor(repository) {
    this.repository = repository || {};
  }

  /**
   * 
   * Lists all users.
   * 
   * @param {object} req 
   * @param {object} res 
   */
  list(req, res) {

    this.repository.list((err, users) => {
      if (err) return res.status(500).json(utils.createError(500));

      if (users !== null && Object.keys(users).length !== 0) {
        res.json(users);
      } else {
        res.status(404).json(utils.createNotFound('user', true));
      }
    });
  }

  /**
   * 
   * @param {object} req 
   * @param {object} res 
   */
  getUserById(req, res) {

    this.repository.get('id', req.params.id, (err, user) => {
      if (err) return res.status(500).json(utils.createError(500));

      if (user) {
        res.json(user);
      } else {
        res.status(404).json(utils.createNotFound('user', false, 'id'));
      }
    });
  }

  /**
   * 
   * @param {object} req 
   * @param {object} res 
   */
  getUserByName(req, res) {
    
    this.repository.get('username', req.params.username, (err, user) => {
      if (err) return res.status(500).json(utils.createError(500));

      if (user) {
        res.json(user);
      } else {
        res.json(null);
      }
    });
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  getUserByEmail(req, res) {
    this.repository.get('email', req.params.email, (err, user) => {
      if (err) return res.status(500).json(utils.createError(500));

      if (user) {
        res.json(user);
      } else {
        res.json(null);
      }
    });
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  add(req, res) {
    
    var params = req.body;

    this.repository.add(params, (err, user) => {
      if (err) {
        if (err.code === 11000) {
          return res.status(409).json(utils.createResourceExist('user'));
        } else {
          return res.status(500).json(utils.createError(500));
        }
      }

      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json(utils.createNotFound('user'));
      }
    });
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  update(req, res) {

    var params = req.body;

    this.repository.update(req.params.id, params, (err, user) => {
      if (err) return res.status(500).json(utils.createError(500));

      if (user) {
        res.status(204).json(user);
      } else {
        res.status(404).json(utils.createNotFound('user'));
      }
    });
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  delete(req, res) {

    this.repository.delete(req.params.id, (err, result) => {
      if (err) return res.status(500).json(utils.createError(500));

      if (result === true) {
        res.status(204).json(null);
      } else {
        res.status(404).json(utils.createNotFound('user'));
      }
    });
  }

  /**
   * 
   * @param {object} req
   * @param {object} res
   */
  authenticate(req, res) {
    this.repository.authenticate(req.body.username, req.body.password, (err, result) => {

      if (err) return res.status(500).json(utils.createError(500));    

      if (result) {
        res.status(200).json(result);
      } else if (result === false) {
        res.status(401).json(result);
      } else {
        res.status(401).json(null);
      }
    });
  }
}

module.exports = UserController;