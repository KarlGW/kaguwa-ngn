'use strict';

process.env.NODE_ENV = 'test';

var should = require('should');
var sinon = require('sinon');

var request = require('request');

var auth = require('../lib/auth');

describe('auth (helper functions)', () => {

  describe('auth', () => {

    afterEach(() => {
      request.post.restore();
    });

    it('should handle a successful authentication correctly', (done) => {

      var mockResponse = { _id: 0, username: 'TestA', groups: ['users'] };
      var mockBody = '{"_id":0, "username": "TestA", "groups": ["users"]}';
    
      sinon.stub(request, 'post').yields(null, { statusCode: 200 }, mockBody);

      var mockCreds = { username: 'UserA', password: '12345' };
      auth.authenticate('http://localhost', mockCreds, (err, jsonResponse) => {
        sinon.assert.called(request.post);
        jsonResponse.should.eql(mockResponse);
        done();
      });
    });

    it('should handle an error from authentication correctly', (done) => {
      var mockBody = '{"code": 500, message: "Server Error"}';
      
      var err = new Error('Server Error');
      sinon.stub(request, 'post').yields(err, { statusCode: 500 }, mockBody);

      var mockCreds = { username: 'UserA', password: '12345' };

      auth.authenticate('http://localhost', mockCreds, (err, jsonResponse) => {
        sinon.assert.called(request.post);
        err.message.should.eql('Server Error');
        done();
      });
    });

    it('should handle authentication failure correctly', (done) => {
      var mockBody = '{"code": 403, "message": "Forbidden"}';
      
      sinon.stub(request, 'post').yields(null, { statusCode: 403 }, mockBody);

      var mockCreds = { username: 'UserA', password: '12345' };

      auth.authenticate('http://localhost', mockCreds, (err, jsonResponse) => {
        sinon.assert.called(request.post);
        jsonResponse.should.eql({code: 403, message: 'Forbidden'});
        done();
      });
    });
  });
});