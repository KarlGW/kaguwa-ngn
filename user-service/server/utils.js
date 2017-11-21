module.exports.createShutdownHooks = function (server, repository) {

  server.on('close', () => {
    console.log('Closing application.');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('Shutting down application.');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('Killing application');
    process.exit(0);
  })
};