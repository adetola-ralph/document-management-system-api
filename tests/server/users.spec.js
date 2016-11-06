// POST /users/ Creates a new user.
// Write a test that validates that a new user created is unique.
// Write a test that validates that a new user created has a role defined. **
// Write a test that validates that a new user created both first and last names.
// Write a test that validates that all users are returned.
// GET /users/ Find matching instances of user.
// GET /users/<id> Find user.
// PUT /users/<id> Update user attributes.
// DELETE /users/<id> Delete user.

'use strict';

const expect    = require('chai').expect;
const supertest = require('supertest');
const server    = require('./../../index');
const api       = supertest(server);

const userData  = require('./data/user-data.js');

describe('User', () => {
  it('should create a new user', (done) => {
    api
      .post('/api/users/')
      .send(userData.normalUser1)
      .expect(201)
      .end((err, res) => {
        expect(res.message).to.equal('User created');
        expect(res.data).to.have.property('id');
        done(err);
      });
  });

  it('should create unique users', (done) => {
    // duplicate email address
    api
      .post('/api/users/')
      .send(userData.duplicateUser2)
      .expect(409)
      .end((err, res) => {
        expect(res.message).to.equal('Duplicate email address');
        done(err);
      });

    //duplicate username test
    api
      .post('/api/users/')
      .send(userData.duplicateUser1)
      .expect(409)
      .end((err, res) => {
        expect(res.message).to.equal('Duplicate username');
        done(err);
      });
  });

  it('should create firstname and lastname for a new user', (done) => {
    api
      .post('/api/users/')
      .send(userData.normalUser2)
      .expect(201)
      .end((err, res) => {
        expect(res.message).to.equal('User created');
        expect(res.data).to.have.property('firstname');
        expect(res.data.firstname).to.equal('Winner');
        expect(res.data).to.have.property('lastname');
        expect(res.data.firstname).to.equal('Bolorunduro');
        done(err);
      });
  });

  it('should return all the users in the database', (done) => {
    api
      .get('/api/users/')
      .expect(200)
      .end((err, res) => {
        expect(res.data.length).to.equal(3);
        done(err);
      });
  });

  it('should find a user', (done) => {
    api
    .get('/api/users/1')
    .expect(200)
    .end((err, res) => {
      done(err);
    });
  });

  it('should update user attribute', (done) => {
    api
      .put('/api/users/1')
      .send({
        lastname: 'Adetola'
      })
      .expect(204)
      .end((err, res) => {
        done(err);
      });
  });

  it('should delete an exisiting user', (done) => {
    api
      .delete('/api/users/3')
      .expect(200)
      .end((err, res) => {
        done(err);
      });
  });
});
