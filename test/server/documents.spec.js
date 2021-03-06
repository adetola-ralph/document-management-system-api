import chai from 'chai';
import supertest from 'supertest';
import request from 'superagent';
import server from './../../index';
import documentData from './data/document-data';
import userData from './data/user-data';
import DocSeeder from './../../seeders/docSeeder';

const api = supertest(server);
const expect = chai.expect;

let adminToken, normalToken1, normalToken2;

describe('Document', () => {
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

  before((done) => {
    // userid = 3
    request
      .post('http://localhost:8080/api/users/login/')
      .send({
        username: userData.normalUser1.username,
        password: userData.normalUser1.password
      })
      .end((err, res) => {
        normalToken1 = res.body.data;
        done(err);
      });
  });

  before((done) => {
    // userid = 2
    request
      .post('http://localhost:8080/api/users/login/')
      .send({
        username: userData.normalUser3.username,
        password: userData.normalUser3.password
      })
      .end((err, res) => {
        normalToken2 = res.body.data;
        done(err);
      });
  });

  before((done) => {
    DocSeeder.startSeed();
    done();
  });

  it('only registered users can create documents', (done) => {
    api
      .post('/api/documents/')
      .send(documentData.documenty)
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).to.equal('Token not provided');
        done(err);
      });
  });

  it('all fields must be filled', (done) => {
    api
      .post('/api/documents/')
      .set('x-access-token', normalToken1)
      .send(documentData.invalidDocument)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('All fields must be filled');
        done(err);
      });
  });

  it('registered users can create documents', (done) => {
    api
      .post('/api/documents/')
      .set('x-access-token', normalToken1)
      .send(documentData.documentx)
      .expect(201)
      .end((err, res) => {
        expect(res.body.message).to.equal('Document created');
        done(err);
      });
  });

  it('should not allow creation of documents with duplicate titles', (done) => {
    api
      .post('/api/documents/')
      .set('x-access-token', normalToken1)
      .send(documentData.documentx)
      .expect(409)
      .end((err, res) => {
        expect(res.body.message).to.equal('A document with the title exists');
        done(err);
      });
  });

  it('should have a published by date', (done) => {
    api
      .post('/api/documents/')
      .set('x-access-token', normalToken2)
      .send(documentData.documenty)
      .expect(201)
      .end((err, res) => {
        expect(res.body.message).to.equal('Document created');
        expect(res.body.data).to.have.property('createdAt');
        done(err);
      });
  });

  it('should have a default access of public', (done) => {
    api
      .post('/api/documents/')
      .set('x-access-token', normalToken2)
      .send(documentData.documentz)
      .expect(201)
      .end((err, res) => {
        expect(res.body.message).to.equal('Document created');
        expect(res.body.data).to.have.property('access');
        expect(res.body.data.access).to.equal('public');
        done(err);
      });
  });

  it('should return all relevant documents belonging to a user', (done) => {
    api
      .get('/api/users/3/documents/')
      .set('x-access-token', normalToken1)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Documents retrieved');
        expect(res.body.data.length).to.equal(7);
        done(err);
      });
  });

  it('admin should have access to all relevant documents belonging to a user', (done) => {
    api
      .get('/api/users/3/documents/')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Documents retrieved');
        expect(res.body.data.length).to.equal(7);
        done(err);
      });
  });

  it('Users with no document should return empty array', (done) => {
    api
      .get('/api/users/4/documents/')
      .set('x-access-token', adminToken)
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.equal('User doesn\'t have any document');
        expect(res.body.data).to.deep.equal([]);
        done(err);
      });
  });

  it('users\'s shouldn\'t have access to other user\'s documents', (done) => {
    api
      .get('/api/users/3/documents/')
      .set('x-access-token', normalToken2)
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('You\'re not authorised to do this');
        done(err);
      });
  });

  it('documents marked private should only be accessible to it\'s creator', (done) => {
    api
      .get('/api/documents/1')
      .set('x-access-token', normalToken2)
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('You\'re not authorised to access this document');
        done(err);
      });
  });

  it('documents marked role should be accessible to users with the same as it\'s creator', (done) => {
    api
      .get('/api/documents/2')
      .set('x-access-token', normalToken2)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Document found');
        done(err);
      });
  });

  it('documents marked public should be accessible to all users', (done) => {
    api
      .get('/api/documents/8')
      .set('x-access-token', normalToken1)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Document found');
        done(err);
      });
  });

  it('admin should be able to get any document', (done) => {
    api
      .get('/api/documents/12')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Document found');
        done(err);
      });
  });

  it('non-existent documents should return 404', (done) => {
    api
      .get('/api/documents/20')
      .set('x-access-token', adminToken)
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.equal('Document doesn\'t exist');
        done(err);
      });
  });

  it('admin should be able to get all the documents', (done) => {
    api
      .get('/api/documents')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Documents retreived');
        expect(res.body.data.length).to.equal(13);
        done(err);
      });
  });

  it('documents should ordered by date', (done) => {
    api
      .get('/api/documents')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Documents retreived');
        expect(res.body.data[0].createdAt).gte(res.body.data[1].createdAt);
        done(err);
      });
  });

  it('normal users should be able to get some of the documents', (done) => {
    api
      .get('/api/documents')
      .set('x-access-token', normalToken2)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Documents retreived');
        expect(res.body.data.length).to.equal(10);
        done(err);
      });
  });

  it('document gotten can be limited', (done) => {
    api
      .get('/api/documents?limit=5')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Documents retreived');
        expect(res.body.data.length).to.be.at.most(5);
        done(err);
      });
  });

  it('start point for getting all documents can be set', (done) => {
    api
      .get('/api/documents?limit=6&offset=2')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Documents retreived');
        expect(res.body.data.length).to.be.at.most(6);
        expect(res.body.data[0].id).to.equal(11);
        done(err);
      });
  });

  it('users should be able to update their document', (done) => {
    api
      .put('/api/documents/5')
      .set('x-access-token', normalToken2)
      .send({
        title: 'Document 5 document edit'
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Document updated');
        expect(res.body.data.title).to.equal('Document 5 document edit');
        done(err);
      });
  });

  it('non-admin users shouldn\'t be able to update other user\'s document', (done) => {
    api
      .put('/api/documents/10')
      .set('x-access-token', normalToken2)
      .send({
        title: 'Document 10 document edit'
      })
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('You\'re not authorised to perform this action');
        done(err);
      });
  });

  it('admin should be able to update any document', (done) => {
    api
      .put('/api/documents/10')
      .set('x-access-token', adminToken)
      .send({
        title: 'Document 10 document edit'
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Document updated');
        expect(res.body.data.title).to.equal('Document 10 document edit');
        done(err);
      });
  });

  it('non-admin users should\'t be able to delete other users documents', (done) => {
    api
      .delete('/api/documents/11')
      .set('x-access-token', normalToken2)
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('You\'re not authorised to perform this action');
        done(err);
      });
  });

  it('admin users should be able to delete any document', (done) => {
    api
      .delete('/api/documents/11')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Document deleted');
        done(err);
      });
  });

  it('users should be able to delete their document', (done) => {
    api
      .delete('/api/documents/12')
      .set('x-access-token', normalToken2)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Document deleted');
        done(err);
      });
  });
});
