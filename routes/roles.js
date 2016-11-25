import Authentication from './../middleware/authentication';
import Authorisation from './../middleware/authorisation';
import RoleController from './../controllers/roles';

const RoleCtr = new RoleController();

export default function roleRouter(router) {
  router
    .route('/roles')
    .get(Authentication.checkAuthentication, Authorisation.checkAuthorisation, RoleCtr.index)
    .post(Authentication.checkAuthentication, Authorisation.checkAuthorisation, RoleCtr.create);

  router
    .route('/roles/:id')
    .get(Authentication.checkAuthentication, Authorisation.checkAuthorisation, RoleCtr.show)
    .put(Authentication.checkAuthentication, Authorisation.checkAuthorisation, RoleCtr.update)
    .delete(RoleCtr.delete);
}
