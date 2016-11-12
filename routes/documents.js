'use strict';

const docCtr        = require('./../controllers/documents.js');
const authentication = require('./../middleware/authentication');
const authorisation  = require('./../middleware/authorisation');

const documentRoutes = (router) => {
  router
    .route('/documents')
    .post(authentication, docCtr.create)
    .get(authentication, docCtr.index);

  router
    .route('/documents/:id')
    .get(authentication, docCtr.show)
    .put(authentication, docCtr.update)
    .delete(authentication, docCtr.delete);

  router
    .get('/users/:uid/documents/');
};

module.exports = documentRoutes;
