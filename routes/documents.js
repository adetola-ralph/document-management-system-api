const docCtr = require('./../controllers/documents.js');
const authentication = require('./../middleware/authentication');

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
    .get('/users/:uid/documents/', authentication, docCtr.getUserDoc);
};

module.exports = documentRoutes;
