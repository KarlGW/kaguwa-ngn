'use strict';

var mongoose = require('mongoose');

module.exports.connect = (connectionSettings) => {

  const uri = connectionSettings.uri;
  const options = connectionSettings.options;
  
  let db;
  mongoose.Promise = global.Promise;
  mongoose.connect(uri, { useMongoClient: true }).catch(() => { console.log('App stopped.'); process.exit(1) });

  db = mongoose.connection;

  //db.on('error', console.error.bind(console, 'Connection error:'));
  db.on('error', (err) => {
    console.error(err.message);
  });

  db.once('open', () => {
    console.log('Connected to database.');
  });

  return db;
}