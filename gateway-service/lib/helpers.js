'use strict';

var request = require('request');

function requestWithPromise(uri) {
  return new Promise((resolve, reject) => {

    request.get(uri, (err, httpResponse, body) => {
      if (err) {
        return reject(err);
      }

      return resolve(httpResponse.statusCode);
    });
  });
}

async function testConnection(uri) {
  try {
    return await requestWithPromise(uri);
  } catch (err) {
    return err.code;
  }
};

module.exports.testServiceConnections = async function (services) {

  var connectionResults = [];

  for (var service in services) {
    if (services.hasOwnProperty(service)) {
      await testConnection(services[service].baseUri).then(res => {
        console.log('--- Testing connection to: ' + services[service].baseUri + ' ---');
        if (res === 200) {
          console.log('--- Connection successful ---\n');
          connectionResults.push(true);
        } else {
          console.error(res);
          connectionResults.push(false);
        }
      });
    }
  }

  return (connectionResults.includes(false));
};
