module.exports = {
  server: {
    port: 3000
  },
  roles: {
    readwrite: "admin",
  },
  services: {
    authService: {
      baseUri: '<url-to-auth-service>'
     }
  },
  db: {
    uri: "mongodb://<host>:<port>/app",
    options: {
      useMongoClient: true
    }
  }
};