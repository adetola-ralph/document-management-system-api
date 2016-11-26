import roleRoutes from './roles';
import userRoutes from './users';
import documentRoutes from './documents';

/**
 * routes
 *
 * routes functions exports all the routes to be attached to the express
 * router object
 *
 * @param {type} router express router object that gets attached to the routes
 * @return {null} doesn't return anything
 */
export default function routes(router) {
  roleRoutes(router);
  userRoutes(router);
  documentRoutes(router);
}
