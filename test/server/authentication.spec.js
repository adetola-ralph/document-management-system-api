import chai from 'chai';
import supertest from 'supertest';
import server from './../../index';
import userData from './data/user-data';

const api = supertest(server);
const expect = chai.expect;
let signinToken;

describe('User authentication', () => {
  it('should expect all fields to be filled', (done) => {
    api
      .post('/api/users/login')
      .send({
        username: userData.normalUser1.username,
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('All fields must be filled');
        done(err);
      });
  });

  it('should fail for wrong password', (done) => {
    api
      .post('/api/users/login')
      .send({
        username: userData.normalUser1.username,
        password: 'wrongpassword'
      })
      .expect(401)
      .end((err, res) => {
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Authentication failed: Wrong password');
        done(err);
      });
  });

  it('should allow registered users to signin', (done) => {
    api
      .post('/api/users/login')
      .send({
        username: userData.normalUser1.username,
        password: userData.normalUser1.password
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Authentication successful');
        expect(res.body).to.have.property('data');
        signinToken = res.body.data;
        done(err);
      });
  });

  it('should reject unregistered users', (done) => {
    api
      .post('/api/users/login')
      .send({
        username: userData.invalidUSer1.username,
        password: userData.invalidUSer1.password
      })
      .expect(401)
      .end((err, res) => {
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Authentication failed: User not found');
        done(err);
      });
  });

  it('should return a message on signout for registered users', (done) => {
    api
      .get('/api/users/logout')
      .set('x-access-token', signinToken)
      .expect(200)
      .end((err, res) => {
        // expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('You have been logged out');
        done(err);
      });
  });

  it('should reject signout request from unregistered users', (done) => {
    api
      .get('/api/users/logout')
      .expect(401)
      .end((err, res) => {
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Token not provided');
        done(err);
      });
  });
});
