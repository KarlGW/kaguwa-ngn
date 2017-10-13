'use strict';

process.env.NODE_ENV = 'test';

var should = require('should');
var sinon = require('sinon');

var User = require('../models/user-model');
var userRepository = require('../repository/user-repository');

var factory = require('./factories');

// Describe mock user model.
var MockUserModel = function (options) {
  this.username = options.username;
};

MockUserModel.prototype.save = function () { };
MockUserModel.prototype.remove = function () { };
MockUserModel.find = function () { };
MockUserModel.findOne = function () { };
MockUserModel.remove = function () { };
MockUserModel.prototype.generateHash = function (value) { value };
MockUserModel.generateHash = function (value) { return value }

var mockUsers = factory.createMockUsers();

var repository;

// Predefine ids
var id1 = "59b82aa3c217762048bc3a38"
var id2 = "59b82aabc217762048bc3a39"
var id3 = "59b82aafc217762048bc3a3a"

describe('UserRepository', function () {

  var mockUserModel = MockUserModel;

    var connectionSettings = {
      model: mockUserModel,
      options: {
        uri: null,
        options: {
          useMongoClient: true
        },
        server: { }
      }
    }

  describe('list()', function () {

    userRepository.connect(connectionSettings, function (repo) {
      repository = repo;
    });

    afterEach(function () {
      mockUserModel.find.restore();
    });

    it('should get all users', function (done) {

      sinon.stub(mockUserModel, 'find').yields(null, mockUsers);

      repository.list(function (err, users) {
        sinon.assert.called(mockUserModel.find);
        users.should.equal(mockUsers);
        done();
      });
    });

    it('should return null if no users are found', function (done) {

      sinon.stub(mockUserModel, 'find').yields(null, []);

      repository.list(function (err, users) {
        sinon.assert.called(mockUserModel.find);
        (users === null).should.equal(true);
        done();
      });
    });

    it('should return an error object if an error has occured', function (done) {

      var err = new Error('Could not connect to database.');
      sinon.stub(mockUserModel, 'find').yields(err, null);

      repository.list(function (err, users) {
        sinon.assert.called(mockUserModel.find);
        err.message.should.equal('Could not connect to database.');
        done();
      });
    });
  });

  describe('get()', function () {

    userRepository.connect(connectionSettings, function (repo) {
      repository = repo;
    });

    afterEach(function () {
      mockUserModel.findOne.restore();
    });
    
    it('should get a user by id', function (done) {

      sinon.stub(mockUserModel, 'findOne').withArgs({ _id: id1}).yields(null, mockUsers[0]);

      repository.get('id', id1, function (err, user) {
        sinon.assert.called(mockUserModel.findOne);
        user.should.equal(mockUsers[0]);
        done();
      });
    });

    it('should get a user by username', function (done) {

      var expectedUser = { _id: id2, username: 'UserB', email: 'userb@test.com' };

      sinon.stub(mockUserModel, 'findOne').withArgs({ username: 'UserB'}).yields(null, mockUsers[1]);

      repository.get('username', 'UserB', function (err, user) {
        sinon.assert.called(mockUserModel.findOne);
        user.should.eql(expectedUser);
        done();
      });
    });

    it('should get a user by email', function (done) {
      var expectedUser = { _id: id1, username: 'UserA', email: 'usera@test.com' };

      sinon.stub(mockUserModel, 'findOne').withArgs({ email: 'usera@test.com' }).yields(null, mockUsers[0]);

      repository.get('email', 'usera@test.com', function (err, user) {
        sinon.assert.called(mockUserModel.findOne);
        user.should.eql(expectedUser);
        done();
      });
    });

    it('should return null if no user is found', function (done) {

      sinon.stub(mockUserModel, 'findOne').yields(null, null);

      repository.get('id', id3, function (err, user) {
        sinon.assert.called(mockUserModel.findOne);
        (user === null).should.equal(true);
        
        repository.get('username', 'UserC', function (err, user) {
          sinon.assert.called(mockUserModel.findOne);
          (user === null).should.equal(true);

          repository.get('email', 'User D', function (err, user) {
            sinon.assert.called(mockUserModel.findOne);
            (user === null).should.equal(true);
            done();
          });
        });
      });
    });

    it('should return an error object if an error occured', function (done) {
      var err = new Error('Could not connect to database.');

      sinon.stub(mockUserModel, 'findOne').yields(err, null);

      repository.get('id', id1, function (err, user) {
        err.message.should.equal('Could not connect to database.');
        done();
      });
    });
  });

  describe('add()', function () {

    userRepository.connect(connectionSettings, function (repo) {
      repository = repo;
    });

    afterEach(function () {
      mockUserModel.prototype.save.restore();
      mockUserModel.findOne.restore();
    });

    it('should add a user and return it', function (done) {

      var expectedUser = {
        _id: 3,
        username: 'UserC',
        password: '12345'
      };

      var params = {
        username: 'UserC',
        password: '12345',
      };

      sinon.stub(mockUserModel.prototype, 'save').yields(null);
      sinon.stub(mockUserModel, 'findOne').yields(null, expectedUser);

      repository.add(params, function(err, user) {
        sinon.assert.called(mockUserModel.prototype.save);
        sinon.assert.called(mockUserModel.findOne);
        user.should.eql(expectedUser);
        done();
      });
    });

    it('should return an error if an error has occured.', function (done) {
      var err = new Error('Error in contacting database.');
      sinon.stub(mockUserModel.prototype, 'save').yields(err, null);
      sinon.stub(mockUserModel, 'findOne');

      var params = {
        username: 'UserA',
        password: '12345',
      }

      repository.add(params, function (err, user) {
        sinon.assert.called(mockUserModel.prototype.save);
        sinon.assert.notCalled(mockUserModel.findOne);
        err.message.should.equal('Error in contacting database.');
        done();
      });
    });
  });

  describe('update()', function () {

    userRepository.connect(connectionSettings, function (repo) {
      repository = repo;
    });

    afterEach(function () {
      mockUserModel.findOne.restore();
    });

    it('should fetch a user by id and update the fields that are provided', function (done) {
      var expectedUser = { _id: 1, username: 'UserX', email: 'usera@test.com' };

      mockUsers[0].save = function (callback) {
        return callback();
      }

      sinon.stub(mockUserModel, 'findOne').withArgs({ _id: 1 })
        .onFirstCall().yields(null, mockUsers[0]);

      sinon.stub(mockUsers[0], 'save').yields(null);

      var params = {
        username: 'UserX'
      };

      repository.update(1, params, function (err, user) {
        sinon.assert.calledOnce(mockUserModel.findOne);
        sinon.assert.called(mockUsers[0].save);
        mockUsers[0].username.should.equal(expectedUser.username);
        mockUsers[0].save.restore();
        done();
      });
    });

    it('should return null if no such user exists', function (done) {

      mockUsers[0].save = function (callback) {
        return callback();
      }

      sinon.stub(mockUserModel, 'findOne').withArgs({ _id: 4 })
        .onFirstCall().yields(null, null);

      sinon.stub(mockUsers[0], 'save').yields(null);

      var params = {
        username: 'UserX'
      };

      repository.update(4, params, function (err, user) {
        sinon.assert.calledOnce(mockUserModel.findOne);
        sinon.assert.notCalled(mockUsers[0].save);
        (user === null).should.equal(true);
        done();
      });

    });

    it('should return an error object if an error has occured', function (done) {

      mockUsers[0].save = function (callback) {
        return callback();
      }

      var params = {
        username: 'UserX'
      };

      var err = new Error('An error occured.');
      sinon.stub(mockUserModel, 'findOne').withArgs({ _id: 5 }).yields(err, null);
      sinon.stub(mockUsers[0], 'save').yields(null);

      repository.update(5, params, function (err, user) {
        sinon.assert.called(mockUserModel.findOne);
        sinon.assert.notCalled(mockUsers[0].save);
        err.message.should.equal('An error occured.');
        done();
      });
    });
  });

  describe('delete()', function () {

    userRepository.connect(connectionSettings, function (repo) {
      repository = repo;
    });

    afterEach(function () {
      mockUserModel.findOne.restore();
      mockUserModel.remove.restore();
    });

    it('should find a user by id and delete it, return true', function (done) {

      sinon.stub(mockUserModel, 'findOne').withArgs({ _id: 2 }).yields(null, mockUsers[1]);
      sinon.stub(mockUserModel, 'remove').yields(null, null);

      repository.delete(2, function (err, result) {
        sinon.assert.called(mockUserModel.findOne);
        sinon.assert.called(mockUserModel.remove);
        result.should.equal(true);
        done();
      });
    });

    it('should return false if a user could not be found', function (done) {
      sinon.stub(mockUserModel, 'findOne').withArgs({ _id: 5 }).yields(null, null);
      sinon.stub(mockUserModel, 'remove').yields(null, null);
      
      repository.delete(5, function (err, result) {
        sinon.assert.calledOnce(mockUserModel.findOne);
        sinon.assert.notCalled(mockUserModel.remove);
        result.should.equal(false);
        done();
      });
    });

    it('should return an error object if an error has occured', function (done) {
      var err = new Error('An error has occured.');

      sinon.stub(mockUserModel, 'findOne').withArgs({ _id: 1 }).yields(err, null);
      sinon.stub(mockUserModel, 'remove').yields(null, null);

      repository.delete(1, function (err, result) {
        sinon.assert.called(mockUserModel.findOne);
        sinon.assert.notCalled(mockUserModel.remove);
        err.message.should.equal('An error has occured.');
        (result === undefined).should.equal(true);
        done();
      });
    });
  });
});