// Write a test that validates that a new role created has a unique title.
// Write a test that validates that all roles are returned when Roles.all is called.

'use strict';

const expect    = require('chai').expect;
const supertest = require('supertest');
const server    = require('./../../index');
const api       = supertest(server);

describe('Roles', () => {
  it('each role should have a unique title', (done) => {
    done();
  });

  it('should return all roles when Roles.all is called', (done) => {
    done();
  });
});
