module.exports = {
  server: {
    port: process.env.port || 3000
  },
  roles: {
    readwrite: process.env.APP_RW || "admin",
  },
  services: {
    authService: {
      baseUri: process.env.AUTH_SVC_URI || '<url-to-auth-service>'
     }
  },
  db: {
    uri: process.env.DB_URI || "mongodb://<host>:<port>/app",
    options: {
      useMongoClient: true
    }
  }
};