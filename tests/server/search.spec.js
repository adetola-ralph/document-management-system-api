// Write a test that validates that all documents, limited by a specified number and ordered by published date, that can be accessed by a specified role.
// Write a test that validates that all documents, limited by a specified number, that were published on a certain date.

'use strict';

const expect        = require('chai').expect;
const supertest     = require('supertest');
const server        = require('./../../index');
const api           = supertest(server);
const request       = require('superagent');

const userData      = require('./data/user-data.js');

let adminToken;

xdescribe('Document', () => {
  before((done) => {
    request
      .post('http://localhost:8080/api/users/login/')
      .send({
        username: userData.adminUser.username,
        password: userData.adminUser.password
      })
      .end(function(err, res){
        adminToken = res.body.data;
        done(err);
      });
  });

  it('Only registered users can create documents', (done) => {
    api
      .post('/api/documents/')
      .send(documentData.documenty)
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('Token not provided');
        done(err);
      });
  });
});
