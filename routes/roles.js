const roleCtr = require('./../controllers/roles.js');
const authentication = require('./../middleware/authentication');
const authorisation = require('./../middleware/authorisation');

const roleRouter = (router) => {
  router
    .route('/roles')
    .get(authentication, authorisation, roleCtr.index)
    .post(authentication, authorisation, roleCtr.create);

  router
    .route('/roles/:id')
    .get(authentication, authorisation, roleCtr.show)
    .put(authentication, authorisation, roleCtr.update)
    .delete(roleCtr.delete);
};

module.exports = roleRouter;
