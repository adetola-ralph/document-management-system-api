'use strict';

const role_routes      = require('./roles');
const user_routes      = require('./users');
const document_routes = require('./documents');

let routes = function(router) {
  role_routes(router);
  user_routes(router);
  document_routes(router);
};

module.exports = routes;
