import Authentication from './../middleware/authentication';
import DocumentController from './../controllers/documents';

const DocCtr = new DocumentController();


/**
 * Document Routes
 *
 * documentRoutes manages the routes for the document resource
 *
 * @param {Object} router express router object that gets attached to all the
 * document routes
 * @return {null} doesn't return anything
 */
export default function documentRoutes(router) {
  router
    .route('/documents')
    .post(Authentication.checkAuthentication, DocCtr.create)
    .get(Authentication.checkAuthentication, DocCtr.index);

  router
    .route('/documents/:id')
    .get(Authentication.checkAuthentication, DocCtr.show)
    .put(Authentication.checkAuthentication, DocCtr.update)
    .delete(Authentication.checkAuthentication, DocCtr.delete);

  // route to get all documents relating to a user id
  router
    .get('/users/:uid/documents/', Authentication.checkAuthentication, DocCtr.getUserDoc);
}
