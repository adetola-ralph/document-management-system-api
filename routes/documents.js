import Authentication from './../middleware/authentication';
import DocumentController from './../controllers/documents';

const DocCtr = new DocumentController();

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

  router
    .get('/users/:uid/documents/', Authentication.checkAuthentication, DocCtr.getUserDoc);
}
