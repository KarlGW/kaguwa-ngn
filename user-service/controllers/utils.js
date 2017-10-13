'use strict';

module.exports.createError = function (code) {
  var messageStr = '';

  if (code === 500) {
    messageStr = 'Error in contacting database.';
  }

  return {
    message: messageStr,
    code: code
  };
};

module.exports.createNotFound = function (type, listAll, identifier) {
  
  if (typeof listAll === undefined) {
    var listAll = false;
  }

  if (identifier === undefined) {
    var identifier = 'id'
  }

  var messageStr;

  if (typeof type !== 'undefined') {
    if (listAll) {
      messageStr = 'No ' + type + 's.';
    } else {
      messageStr = 'No ' + type + ' with that ' + identifier + '.';
    }
  }

  return {
    message: messageStr,
    code: 404
  }
};

module.exports.createResourceExist = function (type) {

  var messageStr;

  if (typeof type !== 'undefined') {
    messageStr = 'A ' + type + ' with that name already exists.';
  }
  // Fill in with more conditions later on.
  return {
    message: messageStr,
    code: 409
  }
}