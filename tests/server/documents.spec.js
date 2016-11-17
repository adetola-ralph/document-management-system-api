// Write a test that validates that a new user document created has a published date defined.
// Write a test that validates that all documents are returned, limited by a specified number, when Documents.all is called with a query parameter limit.
// Write a test that also employs the limit above with an offset as well (pagination). So documents could be fetched in chunks e.g 1st 10 document, next 10 documents (skipping the 1st 10) and so on.
// Write a test that validates that all documents are returned in order of their published dates, starting from the most recent when Documents.all is called.
// POST /documents/ Creates a new document instance.
// GET /documents/ Find matching instances of document.
// GET /documents/<id> Find document.
// PUT /documents/<id> Update document attributes.
// DELETE /documents/<id> Delete document.
// GET /users/<id>/ documents Find all documents belonging to the user .

'use strict';

const expect        = require('chai').expect;
const supertest     = require('supertest');
const server        = require('./../../index');
const api           = supertest(server);
const request       = require('superagent');

const documentData  = require('./data/document-data.js');
const userData      = require('./data/user-data.js');

const docSeeder     = require('./../../seeders/docSeeder');

let adminToken, normalToken1, normalToken2;

describe('Document', () => {
  before((done) => {
    request
      .post('http://localhost:8080/api/users/login/')
      .send({
        username: userData.adminUser.username,
        password: userData.adminUser.password
      })
      .end(function(err, res){
        adminToken = res.body.data;
        done(err);
      });
  });

  before((done) => {
    //userid = 3
    request
      .post('http://localhost:8080/api/users/login/')
      .send({
        username: userData.normalUser1.username,
        password: userData.normalUser1.password
      })
      .end(function(err, res){
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
      .end(function(err, res){
        normalToken2 = res.body.data;
        done(err);
      });
  });

  before((done) => {
    docSeeder.startSeed();
    done();
  });

  it('Only registered users can create documents', (done) => {
    api
      .post('/api/documents/')
      .send(documentData.documenty)
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('Token not provided');
        done(err);
      });
  });

  it('All fields must be filled', (done) => {
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

  it('Registered users can create documents', (done) => {
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

  it('Should not allow creation of documents with duplicate titles', (done) => {
    api
      .post('/api/documents/')
      .set('x-access-token', normalToken1)
      .send(documentData.documentx)
      .expect(409)
      .end((err, res) => {
        expect(res.body.message).to.equal('A document wih the title exists');
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
      .expect(200)
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

  it('admin should be able to get all the documents', (done) => {
    api
      .get('/api/documents')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Documents retreived');
        expect(res.body.data.length).to.equal(12);
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
        expect(res.body.data.length).to.equal(9);
        done(err);
      });
  });

  it('Document gotten can be limited', (done) => {
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth()+1;
    const year = d.getFullYear();

    const date = `${year}-${month}-${day}`;

    api
      .get('/api/documents?limit=5')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Documents retreived');
        expect(res.body.data.length).to.equal(5);
        done(err);
      });
  });

  it('Document gotten can be limited', (done) => {
    api
      .get('/api/documents?limit=5&offset=2')
      .set('x-access-token', adminToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('Documents retreived');
        expect(res.body.data.length).to.equal(5);
        expect(res.body.data[0].id).to.equal(3);
        done(err);
      });
  });

  xit('should find a document by its id', (done) => {
    api
      .get('/api/documents/1')
      .send()
      .expect(200)
      .end((err, res) => {
        expect(res.message).to.equal('Document found');
        expect(res.data).to.equal();
        done(err);
      });
  });

  xit('should update document attribute', (done) => {
    api
      .put('/api/documents/1')
      .send({
        title: ''
      })
      .expect(204)
      .end((err, res) => {
        done(err);
      });
  });

  xit('should delete an exisiting document', (done) => {
    api
      .delete('/api/documents/3')
      .expect(200)
      .end((err, res) => {
        done(err);
      });
  });

});
