'use strict';

const userCtr = require('./../controllers/users.js');
const authentication = require('./../middleware/authentication');
const authorisation  = require('./../middleware/authorisation');

const userRoutes = (router) => {
  router
    .route('/users')
    .post(userCtr.create);
};

module.exports = userRoutes;
