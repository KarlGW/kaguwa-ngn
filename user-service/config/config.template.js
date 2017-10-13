module.exports = {
  db: {
    uri: "mongodb://<ip>:<port>/<col>",
    options: {
      useMongoClient: true
    }
  },
  server: {
    port: 3000
  }
};