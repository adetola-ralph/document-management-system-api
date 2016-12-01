import Authentication from './../middleware/authentication';
import Authorisation from './../middleware/authorisation';
import AuthenticationController from './../controllers/authentication';
import UserController from './../controllers/users';

const UserCtr = new UserController();
const AuthController = new AuthenticationController();

/**
 * user Routes
 *
 * userRoutes manages the routes for the user resource
 *
 * @param {Object} router express router object that gets attached to all the
 * document routes
 * @return {null} doesn't return anything
 */
export default function userRoutes(router) {
  router
    .route('/users')
    .post(UserCtr.create)
    .get(Authentication.checkAuthentication, Authorisation.checkAuthorisation, UserCtr.index);

  router
    .route('/users/:id')
    .get(Authentication.checkAuthentication, UserCtr.get)
    .put(Authentication.checkAuthentication, UserCtr.update)
    .delete(Authentication.checkAuthentication, UserCtr.delete);

  // route that deals with user signin
  router.post('/users/login', AuthController.signin);
  router.get('/users/logout', Authentication.checkAuthentication, AuthController.signout);
}
