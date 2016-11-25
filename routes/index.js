import roleRoutes from './roles';
import userRoutes from './users';
import documentRoutes from './documents';

export default function routes(router) {
  roleRoutes(router);
  userRoutes(router);
  documentRoutes(router);
}
