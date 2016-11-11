// Write a test that validates that a new user created has a role defined. **
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
const jwt       = require('jsonwebtoken');
const dotenv    = require('dotenv').config();

const secret    = process.env.SECRET;

const userData  = require('./data/user-data.js');
let adminToken;
let normalToken;

before(() => {
  adminToken = jwt.sign({username: 'gberikon', roleId: 1}, secret, {
    expiresIn: '24h'
  });
  const normalUser = userData.normalUser3;
  normalUser.id = 2;
  normalToken = jwt.sign(normalUser, secret, {
    expiresIn: '24h'
  });
});

describe('User', () => {
  it('should create a new user', (done) => {
    api
      .post('/api/users/')
      .send(userData.normalUser1)
      .expect(201)
      .end((err, res) => {
        expect(res.body.message).to.equal('User created');
        expect(res.body.data).to.have.property('id');
        done(err);
      });
  });

  it('should not accept duplicate email address', (done) => {
    // duplicate email address
    api
      .post('/api/users/')
      .send(userData.duplicateUser2)
      .expect(409)
      .end((err, res) => {
        expect(res.body.message).to.equal('User already exists');
        done(err);
      });
  });

  it('should not accept duplicate username', (done) => {
    //duplicate username test
    api
      .post('/api/users/')
      .send(userData.duplicateUser1)
      .expect(409)
      .end((err, res) => {
        expect(res.body.message).to.equal('User already exists');
        done(err);
      });
  });

  it('should create firstname and lastname for a new user', (done) => {
    api
      .post('/api/users/')
      .send(userData.normalUser2)
      .expect(201)
      .end((err, res) => {
        expect(res.body.message).to.equal('User created');
        expect(res.body.data).to.have.property('firstname');
        expect(res.body.data.firstname).to.equal('Winner');
        expect(res.body.data).to.have.property('lastname');
        expect(res.body.data.lastname).to.equal('Bolorunduro');
        done(err);
      });
  });

  it('should return all the users in the database when requested by an admin', (done) => {
    api
      .get('/api/users/')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.length).to.equal(4);
        done(err);
      });
  });

  it('should return an error message when all users are requested by a non-admin', (done) => {
    api
      .get('/api/users/')
      .set('x-access-token', normalToken)
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('Not authorised to perform this action');
        done(err);
      });
  });

  it('admin user should be able to find a user', (done) => {
    api
    .get('/api/users/2')
    .set('x-access-token', adminToken)
    .expect(200)
    .end((err, res) => {
      expect(res.body.data).to.be.defined;
      expect(res.body.data.id).to.equal(2);
      done(err);
    });
  });

  it('normal users should be able to find their details', (done) => {
    api
    .get('/api/users/2')
    .set('x-access-token', normalToken)
    .expect(200)
    .end((err, res) => {
      expect(res.body.data).to.be.defined;
      expect(res.body.data.id).to.equal(2);
      done(err);
    });
  });

  it('normal users shouldn\'t be able to find other users', (done) => {
    api
    .get('/api/users/3')
    .set('x-access-token', normalToken)
    .expect(403)
    .end((err, res) => {
      expect(res.body.message).to.equal('You\'re not allowed to perform this action');
      done(err);
    });
  });

  it('Admin users should be able to update their details', (done) => {
    api
      .put('/api/users/2')
      .set('x-access-token', adminToken)
      .send({
        firstname: 'firstname'
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.firstname).to.equal('firstname');
        done(err);
      });
  });

  it('normal users should be able to update their details', (done) => {
    api
      .put('/api/users/2')
      .set('x-access-token', normalToken)
      .send({
        lastname: 'Lastname'
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.lastname).to.equal('Lastname');
        done(err);
      });
  });

  it('normal users shouldn\'t be able to update other users', (done) => {
    api
      .put('/api/users/3')
      .set('x-access-token', normalToken)
      .send({
        lastname: 'Lastname'
      })
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('You\'re not allowed to perform this action');
        done(err);
      });
  });

  it('Admin users should be able to delete an exisiting user', (done) => {
    api
      .delete('/api/users/4')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('User deleted');
        done(err);
      });
  });

  it('Return 404 if admin tries to delete non-existent user', (done) => {
    api
      .delete('/api/users/4')
      .set('x-access-token', adminToken)
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.equal('User doesn\'t exist');
        done(err);
      });
  });

  it('normal users shouldn\'t be able to delete a user', (done) => {
    api
      .delete('/api/users/3')
      .set('x-access-token', normalToken)
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('Not authorised to perform this action');
        done(err);
      });
  });
});
