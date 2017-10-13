'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

var User = mongoose.Schema({
  username: { type: String, require: true, index: { unique: true } },
  password: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  groups: { type: [], default: ['users'] },
  info: {
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    signature: { type: String, default: "Fill in your signature" }
  },
  created_at: { type: Date, defualt: Date.now },
  updated_at: { type: Date, default: null },
  disabled: { type: Boolean, default: false },
});

User.pre('save', function(next) {
  var now = new Date();
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

// Generate hash.
User.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// Check if valid.
User.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', User);