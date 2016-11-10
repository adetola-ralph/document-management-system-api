'use strict';

const role_routes = require('./roles');
const user_routes = require('./users');

let routes = function(router) {
  role_routes(router);
  user_routes(router);
};

module.exports = routes;
