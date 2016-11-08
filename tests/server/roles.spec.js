// Write a test that validates that a new role created has a unique title.
// Write a test that validates that all roles are returned when Roles.all is called.

'use strict';

const expect    = require('chai').expect;
const supertest = require('supertest');
const server    = require('./../../index');
const api       = supertest(server);

const roleData  = require('./data/role-data');

describe('Roles', () => {
  it('each role should have a unique title', (done) => {
    api
      .post('/api/roles/')
      .send(roleData.testRole)
      .expect(201)
      .end((err, res) => {
        expect(res.message).to.equal(`${roleData.testRole.title} role created successfully`);
        expect(res.data.title).to.equal(`${roleData.testRole.title}`);
        done(err);
      });

      api
        .post('/api/roles/')
        .send(roleData.guestRole)
        .expect(409)
        .end((err, res) => {
          expect(res.message).to.equal(`${roleData.guestRole.title} role exists`);
          done(err);
        });
  });

  it('should return all roles when Roles.all is called', (done) => {
    api
      .get('/api/roles/')
      .expect(200)
      .end((err, res) => {
        expect(res.data).to.equal(4);
        done(err);
      });
  });
});
