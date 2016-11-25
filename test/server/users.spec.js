import chai from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import server from './../../index';
import userData from './data/user-data';

const api = supertest(server);
const secret = process.env.SECRET;
const expect = chai.expect;
dotenv.config({ silent: true });

let adminToken;
let normalToken;

before(() => {
  adminToken = jwt.sign({ username: 'gberikon', roleId: 1 }, secret, {
    expiresIn: '24h'
  });
  const normalUser = userData.normalUser3;
  normalUser.id = 2;
  normalToken = jwt.sign(normalUser, secret, {
    expiresIn: '24h'
  });
});

describe('User', () => {
  it('all fields must be filled', (done) => {
    api
      .post('/api/users/')
      .send(userData.invalidUSer1)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('All fields must be filled');
        done(err);
      });
  });

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

  it('non-authenticated users can\'t create an admin', (done) => {
    api
      .post('/api/users/')
      .send(userData.adminUser2)
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('You must be authenticated to create an admin user');
        done(err);
      });
  });

  it('non-admin users can\'t create an admin', (done) => {
    api
      .post('/api/users/')
      .set('x-access-token', normalToken)
      .send(userData.adminUser2)
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('You must be an admin user to create another admin user');
        done(err);
      });
  });

  it('admin users can create another admin', (done) => {
    api
      .post('/api/users/')
      .set('x-access-token', adminToken)
      .send(userData.adminUser2)
      .expect(201)
      .end((err, res) => {
        expect(res.body.message).to.equal('User created');
        done(err);
      });
  });

  it('should reject users with invalid roles', (done) => {
    api
      .post('/api/users/')
      .send(userData.invalidUser2)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('Please select a valid role');
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
        expect(res.body.data.length).to.equal(5);
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
      .put('/api/users/4')
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
