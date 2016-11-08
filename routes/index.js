'use strict';

const role_routes = require('./roles');

let routes = function(router) {
  role_routes(router);
};

module.exports = routes;
