// Factories to create mock objects.
module.exports.createMockUsers = (empty) => {
  if (empty) {
    return [];
  } else {
    return [
      { _id: "59b82aa3c217762048bc3a38", username: 'UserA', email: 'usera@test.com' },
      { _id: "59b82aabc217762048bc3a39", username: 'UserB', email: 'userb@test.com' }
    ];
  }
};

module.exports.createMockResponse = (type) => {

  var res =  {
    status: function (httpCode) {
      this.status = httpCode;
      return this;
    }
  };

  if (type === 'users') {
    res.json = (object) => {
      if (object === null || typeof object.message === 'undefined') {
        this.users = object;
      } else {
        this.message = object.message;
        this.code = object.code;
      }
    }
  } else if (type === 'user') {
    res.json = (object) => {
      if (object === null || typeof object.message === 'undefined') {
        this.user = object;
      } else {
        this.message = object.message;
        this.code = object.code;
      }
    }
  }

  return res;
};