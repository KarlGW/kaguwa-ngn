'use strict';

var mongoose = require('mongoose');
var db;

module.exports.connect = (connectionSettings) => {

  var uri = connectionSettings.uri;
  var options = connectionSettings.options;
  
  mongoose.Promise = global.Promise;
  mongoose.connect(uri, { useMongoClient: true });

  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to database.');
  });

  return db;
}