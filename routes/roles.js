import Authentication from './../middleware/authentication';
import Authorisation from './../middleware/authorisation';
import RoleController from './../controllers/roles';

const RoleCtr = new RoleController();

/**
 * Role Routes
 *
 * roleRoutes manages the routes for the role resource
 *
 * @param {Object} router express router object that gets attached to all the
 * role routes
 * @return {null} doesn't return anything
 */
export default function roleRoutes(router) {
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
