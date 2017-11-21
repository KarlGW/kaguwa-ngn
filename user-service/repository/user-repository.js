'use strict';

var db = require('./db');

class UserRepository {

  constructor(options) {
    this.connectionSettings = options.connectionSettings || { connectionSettings: null };

    if (this.connectionSettings.uri != null) {
      this.connection = db.connect(this.connectionSettings);
    }
    
    this.model = options.model || null;
    this.checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  }

  /**
   * Gets all available users.
   */
  list(callback) {

    var User = this.model;

    var omit = { password: 0, __v: 0 };

    User.find({}, omit, function (err, users) {
      if (err) return callback(err);

      if (Object.keys(users).length !== 0) {
        callback(null, users);
      } else {
        callback(null, null);
      }
    })
  }

  /**
   * get()
   * 
   * Gets user by id.
   * 
   * @param {Guid} id 
   */
  get(type, value, callback) {
    var User = this.model;

    var filter;

    var omit = { password: 0, __v: 0 };

    if (type === 'id' && this.checkForHexRegExp.test(value)) {

      var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
      filter = { _id: value }

    } else if (type === 'username') {
      filter = { username: value }
    } else if (type === 'email') {
      filter = { email: value }
    } else {
      return callback(null, null);
    }

    User.findOne(filter, omit, function (err, user) {
      if (err) return callback(err);

      if (!user) {
        callback(null, null);
      } else {
        callback(null, user);
      }
    });
  }

  /**
   * add()
   * 
   * @param {*} params 
   * @param {*} callback 
   */
  add(params, callback) {

    var User = this.model;
    var omit = { password: 0, __v: 0 };
    // Add validation for username, password and email.

    var user = new User({
      username: params.username,
      email: params.email,
      password: params.password,
    });

    user.password = user.generateHash(params.password);

    user.save(function (err) {
      if (err) return callback(err);

      User.findOne({ _id: user._id }, omit, function (err, user) {
        if (err) return callback(err);

        if (!user) {
          callback(null, null);
        } else {
          callback(null, user);
        }
      });
    });
  }

  /**
   * update()
   * 
   * @param {*} id 
   * @param {*} params 
   */
  update(id, params, callback) {

    var User = this.model;

    User.findOne({ _id: id }, function (err, user) {
      if (err) return callback(err);

      if (user) {
        var now = new Date();

        if (params.username) user.username = params.username;
        if (params.password) {
          var usr = new User();
          user.password = usr.generateHash(params.password);
        }

        if (params.email) user.email = params.email;
        if (params.groups) user.groups = params.groups;

        user.updated_at = now;

        user.save(function (err) {
          if (err) return callback(err);

          callback(null, user);
        });
      } else {
        callback(null, null);
      }
    });
  }

  /**
   * 
   * @param {*} id 
   * @param {*} callback 
   */
  delete(id, callback) {

    var User = this.model;

    User.findOne({ _id: id }, function (err, user) {
      if (err) return callback(err);

      if (user) {
        User.remove({ _id: user._id }, function (err) {
          if (err) return callback(err);

          callback(null, true);
        });
      } else {
        callback(null, false);
      }
    });
  }

  authenticate(username, password, callback) {

    var User = this.model;
   
    User.findOne({ username: username}, function (err, user) {
      if (err) return callback(err)

      if (user) {
        if (user.validPassword(password)) {
          callback(null, user);
        } else {
          callback(null, false);
        }
      } else {
        callback(null, null);
      }
    });

  }

  disconnect() {
    this.connection.close();
  }
}

module.exports.connect = function (connectionSettings, callback) {
  callback(new UserRepository(connectionSettings));
};