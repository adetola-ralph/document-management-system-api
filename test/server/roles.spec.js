const expect = require('chai').expect;
const supertest = require('supertest');
const server = require('./../../index');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({ silent: true });
const roleData = require('./data/role-data');
const userData = require('./data/user-data');
const models = require('./../../models/index');

const api = supertest(server);
const secret = process.env.SECRET;
const userModel = models.Users;
const roleModel = models.Roles;
let adminToken;
let normalToken;

before((done) => {
  roleModel.create({ title: 'admin' }).then(() => {});
  userModel.create(userData.adminUser).then((user) => {
    console.log(`${user.username} created`);
    adminToken = jwt.sign(user.dataValues, secret, {
      expiresIn: '24h'
    });
    done();
  });
});

before((done) => {
  roleModel.create({ title: 'normal' }).then(() => {});
  userModel.create(userData.normalUser3).then((user) => {
    console.log(`${user.username} created`);
    normalToken = jwt.sign(user.dataValues, secret, {
      expiresIn: '24h'
    });
    done();
  });
});

describe('Roles', () => {
  it('each role should have a unique title', (done) => {
    api
      .post('/api/roles/')
      .set('x-access-token', adminToken)
      .send(roleData.guestRole)
      .expect(201)
      .end((err, res) => {
        expect(res.body.message).to.equal(`${roleData.guestRole.title} role created successfully`);
        expect(res.body.data.title).to.equal(`${roleData.guestRole.title}`);
        done(err);
      });
  });

  it('role title cannot be empty', (done) => {
    api
      .post('/api/roles/')
      .set('x-access-token', adminToken)
      .send(roleData.invalidRole)
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('Title cannot be empty');
        done(err);
      });
  });

  it('should not allow duplicate roles', (done) => {
    api
      .post('/api/roles/')
      .set('x-access-token', adminToken)
      .send(roleData.guestRole)
      .expect(409)
      .end((err, res) => {
        expect(res.body.message).to.equal(`${roleData.guestRole.title} role exists`);
        done(err);
      });
  });

  it('should return all roles when Roles.all is called', (done) => {
    api
      .get('/api/roles/')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.length).to.equal(3);
        done(err);
      });
  });

  it('can get roles by id', (done) => {
    api
      .get('/api/roles/1')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('role retreived');
        expect(res.body.data.title).to.equal('admin');
        done(err);
      });
  });

  it('should return 404 if the role requested doesn\'t exist', (done) => {
    api
      .get('/api/roles/4')
      .set('x-access-token', adminToken)
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.equal('Role does not exist');
        done(err);
      });
  });

  it('can update a role\'s title', (done) => {
    api
      .put('/api/roles/2')
      .set('x-access-token', adminToken)
      .send({ title: 'regular' })
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('updated successfully');
        done(err);
      });
  });

  it('should return 404 if the role to be updated doesn\'t exist', (done) => {
    api
      .put('/api/roles/4')
      .set('x-access-token', adminToken)
      .send({ title: 'regular' })
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.equal('Role does not exist');
        done(err);
      });
  });

  describe('Unauthorised users', () => {
    it('shouldn\'t be able to create new roles', (done) => {
      api
        .post('/api/roles/')
        .set('x-access-token', normalToken)
        .send(roleData.guestRole)
        .expect(403)
        .end((err, res) => {
          expect(res.body.message).to.equal('Not authorised to perform this action');
          done(err);
        });
    });

    it('shouldn\'t return all roles when Roles.all is called', (done) => {
      api
        .get('/api/roles/')
        .set('x-access-token', normalToken)
        .expect(403)
        .end((err, res) => {
          expect(res.body.message).to.equal('Not authorised to perform this action');
          done(err);
        });
    });

    it('shouldn\'t be able get any role by id', (done) => {
      api
        .get('/api/roles/1')
        .set('x-access-token', normalToken)
        .expect(403)
        .end((err, res) => {
          expect(res.body.message).to.equal('Not authorised to perform this action');
          done(err);
        });
    });

    it('shouldn\'t be able to update a role\'s title', (done) => {
      api
        .put('/api/roles/2')
        .set('x-access-token', normalToken)
        .send({ title: 'regular' })
        .expect(403)
        .end((err, res) => {
          expect(res.body.message).to.equal('Not authorised to perform this action');
          done(err);
        });
    });
  });
});
