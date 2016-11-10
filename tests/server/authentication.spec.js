'use strict';

const expect        = require('chai').expect;
const supertest     = require('supertest');
const server        = require('./../../index');
const api           = supertest(server);

describe('User authentication', () => {
  it('should allow registered users to signin', (done) => {
    api
      .post('/api/users/')
  });
});
