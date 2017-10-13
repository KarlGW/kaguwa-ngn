'use strict';

var db = require('./db');

class UserInfoRepository {

  constructor(options) {
    this.connectionSettings = options.connectionSettings || { connectionSettings: null };

    if (this.connectionSettings.uri != null) {
      this.connection = db.connect(this.connectionSettings);
    }

    this.model = options.model || null;
    this.checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  }

  get(id, callback) {

    var UserInfo = this.model;

    UserInfo.findOne({ user_id: id }, function (err, userInfo) {
      if (err) return callback(err);

      if (!userInfo) {
        callback(null, null);
      } else {
        callback(null, userInfo);
      }
    });
  }

  add(params, callback) {
    var UserInfo = this.model;

    var userInfo = new UserInfo({
      user_id: params.user_id,
      first_name: params.first_name,
      last_name: params.last_name,
      signature: params.signature
    });

    userInfo.save(function (err) {
      if (err) return callback(err);

      UserInfo.findOne({ _id: userInfo._id }, function (err, userInfo) {
        if (err) return callback(err);

        if (!userInfo) {
          callback(null, null);
        } else {
          callback(null, userInfo);
        }
      });
    });
  }

  update(id, params, callback) {
  
    var UserInfo = this.model;

    UserInfo.findOne({ user_id: id }, function (err, userInfo) {
      if (err) return callback(err);

      if (userInfo) {

        var now = new Date();

        if (params.first_name) userInfo.first_name = params.first_name;
        if (params.last_name) userInfo.last_name = params.last_name;
        if (params.signature) userInfo.signature = params.signature;

        userInfo.save(function (err) {
          if (err) return callback(err);

          callback(null, userInfo);
        });
      } else {
        callback(null, null);
      }
    });
  }

  delete(id, callback) {

    var UserInfo = this.model;

    UserInfo.findOne({ user_id: id}, function (err, userInfo) {
      if (err) return callback(err);

      if (userInfo) {
        UserInfo.remove({ user_id: id }, function (err) {
          if (err) return callback(err);

          callback(null, true);
        });
      } else {
        callback(null, false);
      }
    });
  }
}