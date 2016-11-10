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

const documentData  = require('./data/document-data.js');

xdescribe('Document', () => {
  it('should have a published by date', (done) => {
    api
      .post('/api/documents/')
      .send()
      .expect(201)
      .end((err, res) => {
        expect(res.message).to.equal('Document created');
        expect(res.data).to.have.property('createdAt');
        done(err);
      });
  });

  it('should return all relevant documents', (done) => {
    api
      .get('/api/documents/')
      .send()
      .expect(200)
      .end((err, res) => {
        expect(res.message).to.equal();
        expect(res.data).to.equal();
        done(err);
      });
  });

  it('should find a document by its id', (done) => {
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

  it('should update document attribute', (done) => {
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

  it('should delete an exisiting document', (done) => {
    api
      .delete('/api/documents/3')
      .expect(200)
      .end((err, res) => {
        done(err);
      });
  });

  it('should return all relevant documents belonging to a user', (done) => {
    api
      .get('/api/user/1/documents/')
      .send()
      .expect(200)
      .end((err, res) => {
        expect(res.message).to.equal();
        expect(res.data).to.equal();
        done(err);
      });
  });
});
