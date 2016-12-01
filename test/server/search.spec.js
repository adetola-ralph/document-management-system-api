import chai from 'chai';
import supertest from 'supertest';
import request from 'superagent';
import server from './../../index';
import userData from './data/user-data';

const api = supertest(server);
const expect = chai.expect;

let adminToken;

describe('Search', () => {
  before((done) => {
    request
      .post('http://localhost:8080/api/users/login/')
      .send({
        username: userData.adminUser.username,
        password: userData.adminUser.password
      })
      .end((err, res) => {
        adminToken = res.body.data;
        done(err);
      });
  });

  it('date can be set for documents search', (done) => {
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const date = `${year}-${month}-${day}`;
    api
      .get(`/api/documents?limit=4&date=${date}`)
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Documents retreived');
        expect(res.body.data.length).to.be.at.most(4);
        done(err);
      });
  });

  it('role and date can be set for documents search', (done) => {
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const date = `${year}-${month}-${day}`;
    api
      .get(`/api/documents?limit=6&date=${date}&role=2`)
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Documents retreived');
        expect(res.body.data.length).to.be.at.most(6);
        done(err);
      });
  });
});
