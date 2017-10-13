'use strict';

let mongoose = require('mongoose');

var UserInfo = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, require: true, index: { unique: true } },
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  signature: { type: String, default: null }
});

module.exports = mongoose.model('userInfo', UserInfo);