'use strict';

const userCtr        = require('./../controllers/users.js');
const userAuth       = require('./../controllers/authentication.js');
const authentication = require('./../middleware/authentication');
const authorisation  = require('./../middleware/authorisation');

const userRoutes = (router) => {
  router
    .route('/users')
    .post(userCtr.create);

  router.post('/users/login', userAuth.signin);
  router.post('/users/logout', userAuth.signout);
};

module.exports = userRoutes;
