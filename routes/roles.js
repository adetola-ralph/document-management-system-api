'use strict';

const roleCtr = require('./../controllers/roles.js');
const authentication = require('./../middleware/authentication');
const authorisation  = require('./../middleware/authorisation');

const roleRouter = (router) => {
  router
    .route('/roles')
    .get(authentication, roleCtr.index)
    .post(authentication, roleCtr.create);

  router
    .route('/roles/:id')
    .get(authentication, roleCtr.show)
    .put(authentication, roleCtr.update)
    .delete(roleCtr.delete);
};

module.exports = roleRouter;
