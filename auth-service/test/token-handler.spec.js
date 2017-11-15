'use strict';

process.env.NODE_ENV = 'test';

var should = require('should');
var sinon = require('sinon');

var jwt = require('jsonwebtoken');

var TokenHandler = require('../lib/token-handler');


describe('TokenHandler', () => {

  var tokenHandler = new TokenHandler('secret');

  describe('generateToken() and verifyToken()', () => {

    var mockUserResponse = {
      _id: 1,
      username: 'TestA',
      groups: ['users']
    };

    it('should generate a token and decode successfully', (done) => {

      var token = tokenHandler.generateToken(mockUserResponse);

      tokenHandler.verifyToken(token, (err, decoded) => {
        decoded.username.should.eql('TestA');
        decoded.groups[0].should.eql('users');
        decoded.id.should.eql(1);
        done();
      });
    });

    it('should return an error if no token is specified', (done) => {

      tokenHandler.verifyToken(null, (err, decoded) => {
        err.message.should.eql('No token provided.');
        err.code.should.eql(1000);
        done();
      });
    });

    it('should return an error if the token could not be verified', (done) => {

      var token = tokenHandler.generateToken(mockUserResponse);

      var err = new Error();
      sinon.stub(jwt, 'verify').yields(err, null);

      tokenHandler.verifyToken(token, (err, decoded) => {

        sinon.assert.called(jwt.verify);
        (decoded === undefined).should.equal(true);
        err.code.should.eql(1001);
        err.message.should.eql('Could not verify token.');
        done();
      });
    });
  });
});