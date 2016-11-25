import Authentication from './../middleware/authentication';
import Authorisation from './../middleware/authorisation';
import AuthenticationController from './../controllers/authentication';
import UserController from './../controllers/users';

const UserCtr = new UserController();
const AuthController = new AuthenticationController();

export default function userRoutes(router) {
  router
    .route('/users')
    .post(UserCtr.create)
    .get(Authentication.checkAuthentication, Authorisation.checkAuthorisation, UserCtr.index);

  router
    .route('/users/:id')
    .get(Authentication.checkAuthentication, UserCtr.show)
    .put(Authentication.checkAuthentication, UserCtr.update)
    .delete(Authentication.checkAuthentication, Authorisation.checkAuthorisation, UserCtr.delete);

  router.post('/users/login', AuthController.signin);
}
