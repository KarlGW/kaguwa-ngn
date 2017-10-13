'use strict';

process.env.NODE_ENV = 'test';

var should = require('should');
var sinon = require('sinon');
var UserController = require('../controllers/user-controller');

var factory = require('./factories');

// Create mock repository.
var MockUserRepository = function () {

};

var mockUserRepository = new MockUserRepository();

mockUserRepository.list = function () { };
mockUserRepository.get = function () { };
mockUserRepository.add = function () { };
mockUserRepository.update = function () { };
mockUserRepository.delete = function () { };

var id1 = "59b82aa3c217762048bc3a38"
var id2 = "59b82aabc217762048bc3a39"
var id3 = "59b82aafc217762048bc3a3a"
var id4 = "59b832f3814174235c0f2bf5"

describe('UserController', function () {
 
  var userController = new UserController(mockUserRepository);
  var mockUsers = factory.createMockUsers();

  var req, res, err;

  describe('list()', function () {

    afterEach(function () {
      mockUserRepository.list.restore();
    });

    it('should return the correct response if call is successfull', function (done) {

      sinon.stub(mockUserRepository, 'list').yields(null, mockUsers);

      req = { };
      res = factory.createMockResponse('users');

      userController.list(req, res);

      sinon.assert.called(mockUserRepository.list);
      res.users.should.eql(mockUsers);
      done();
    });

    it('should return \'No users.\' if no users can be found', function (done) {

      sinon.stub(mockUserRepository, 'list').yields(null, []);

      req = { };
      res = factory.createMockResponse('users');

      userController.list(req, res);
      
      sinon.assert.called(mockUserRepository.list);
      res.message.should.equal('No users.');
      res.code.should.equal(404);
      done();
    });

    it('should return the correct code and message if an error occured', function (done) {

      var err = new Error();

      sinon.stub(mockUserRepository, 'list').yields(err, null);

      req = { };
      res = factory.createMockResponse('users');

      userController.list(req, res);

      sinon.assert.called(mockUserRepository.list);
      res.message.should.equal('Error in contacting database.');
      done();
    });

  });

  describe('getUserById()', function () {

    afterEach(function () {
      mockUserRepository.get.restore();
    });

    it('should return a user by id', function (done) {

      sinon.stub(mockUserRepository, 'get').withArgs('id', id1).yields(null, mockUsers[0]);

      req = { params: { id: id1 }};
      res = factory.createMockResponse('user');

      userController.getUserById(req, res);
      
      sinon.assert.called(mockUserRepository.get);
      res.user.should.eql(mockUsers[0]);
      done();
    });

    it('should return \'No user with that id.\' if no user can be found', function (done) {

      sinon.stub(mockUserRepository, 'get').withArgs('id', id3).yields(null, null);

      req = { params: { id: id3 }};
      res = factory.createMockResponse('user');

      userController.getUserById(req, res);

      sinon.assert.called(mockUserRepository.get);
      res.message.should.equal('No user with that id.')
      res.code.should.equal(404);
      done();
    });

    it('should return the correct code and message if an error occured', function (done) {

      var err = new Error();
      
      sinon.stub(mockUserRepository, 'get').withArgs('id', id3).yields(err, null);

      req = { params: { id: id3 }};
      res = factory.createMockResponse('user');

      userController.getUserById(req, res);

      sinon.assert.called(mockUserRepository.get);
      res.message.should.equal('Error in contacting database.');
      res.code.should.equal(500);
      done();
    });

  });

  describe('add()', function () {
    
    afterEach(function () {
      mockUserRepository.add.restore();
    });

    it('should add a new user and return it', function (done) {

      var expectedUser = {
        _id: 3,
        username: 'UserC',
        password: '12345',
        information: {
          first_name: 'User',
          last_name: 'C',
          signature: 'Test signature'
        }
      };

      var params = {
        username: 'UserC',
        password: '12345',
        first_name: 'User',
        last_name: 'C',
        signature: 'Test signature'
      };

      sinon.stub(mockUserRepository, 'add').withArgs(params).yields(null, expectedUser);

      req = { body: params };
      res = factory.createMockResponse('user');

      userController.add(req, res);

      sinon.assert.called(mockUserRepository.add);
      res.user.should.eql(expectedUser);
      done();
    });

    it('should return the correct code and message if an error occured', function (done) {

      var err = new Error();

      var params = {
        username: 'UserC',
        password: '12345',
        first_name: 'User',
        last_name: 'C',
        signature: 'Test signature'
      };

      sinon.stub(mockUserRepository, 'add').withArgs(params).yields(err, null);

      req = { body: params };
      res = factory.createMockResponse('user');

      userController.add(req, res);

      sinon.assert.called(mockUserRepository.add);
      res.message.should.equal('Error in contacting database.');
      res.code.should.equal(500);
      done();
    });

  });

  describe('update()', function () {

    afterEach(function () {
      mockUserRepository.update.restore();
    });

    it('should update a user and return it', function (done) {

      var expectedUser = {
        _id: id1,
        username: 'UserX',
        password: '12345',
        information: {
          first_name: 'User',
          last_name: 'A',
          signature: 'Test signature'
        }
      };

      var params = { username: 'UserX' };

      sinon.stub(mockUserRepository, 'update').withArgs(id1, params).yields(null, expectedUser);

      req = { body: params, params: { id: id1 }};
      res = factory.createMockResponse('user');

      userController.update(req, res);

      sinon.assert.called(mockUserRepository.update);
      res.user.should.eql(expectedUser);
      done();
    });

    it('should return correct message and code if user is not found', function (done) {

      var params = { username: 'UserZ' };

      sinon.stub(mockUserRepository, 'update').withArgs(id1, params).yields(null, null);

      req = { body: params, params: { id: id1 }};
      res = factory.createMockResponse('user');

      userController.update(req, res);

      sinon.assert.called(mockUserRepository.update);
      res.message.should.equal('No user with that id.');
      res.code.should.equal(404);
      done();
    });

    it('should return the correct code and message if an error occured', function (done) {

      var err = new Error();

      var params = { username: 'User>' };

      sinon.stub(mockUserRepository, 'update').withArgs(id1, params).yields(err, null);

      req = { body: params, params: { id: id1 }};
      res = factory.createMockResponse('user');

      userController.update(req, res);

      sinon.assert.called(mockUserRepository.update);
      res.message.should.equal('Error in contacting database.');
      res.code.should.equal(500);
      done();
    });

  });

  describe('delete()', function () {

    afterEach(function () {
      mockUserRepository.delete.restore();
    });

    it('should remove a user and return null', function (done) {

      sinon.stub(mockUserRepository, 'delete').withArgs(id1).yields(null, true);

      req = { params: { id: id1 }};
      res = factory.createMockResponse('user');

      userController.delete(req, res);

      sinon.assert.called(mockUserRepository.delete);
      (res.user === null).should.equal(true);
      res.status.should.equal(204);
      done();
    });

    it('should return correct message and code if user cannot be found', function (done) {

      sinon.stub(mockUserRepository, 'delete').withArgs(id4).yields(null, false);

      req = { params: { id: id4 }};
      res = factory.createMockResponse('user');

      userController.delete(req, res);

      sinon.assert.called(mockUserRepository.delete);
      res.message.should.equal('No user with that id.');
      res.code.should.equal(404);
      done();
    });

    it('should return the correct code and message if an error occured', function (done) {

      var err = new Error();

      sinon.stub(mockUserRepository, 'delete').withArgs(id4).yields(err, null);
      
      req = { params: { id: id4 }};
      res = factory.createMockResponse('user');

      userController.delete(req, res);

      sinon.assert.called(mockUserRepository.delete);
      res.message.should.equal('Error in contacting database.');
      res.code.should.equal(500);
      done();
    });

  });

});
