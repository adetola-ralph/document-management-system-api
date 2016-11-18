const roleRoutes = require('./roles');
const userRoutes = require('./users');
const documentRoutes = require('./documents');

const routes = (router) => {
  roleRoutes(router);
  userRoutes(router);
  documentRoutes(router);
};

module.exports = routes;
