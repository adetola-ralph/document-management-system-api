const expect = require('chai').expect;
const supertest = require('supertest');
const server = require('./../../index');

const api = supertest(server);
const userData = require('./data/user-data.js');

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
      .expect(403)
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
      .expect(404)
      .end((err, res) => {
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Authentication failed: User not found');
        done(err);
      });
  });
});
