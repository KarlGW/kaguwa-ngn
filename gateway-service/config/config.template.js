module.exports = {
  server: {
    port: 8080
  },
  roles: {
    readwrite: "admin",
  },
  services: {
    userService: {
      baseUri: 'http://<ip>:<port>/api'
    },
    authService: {
      baseUri: 'http://<ip>:<port>/api',
    }
  }
};