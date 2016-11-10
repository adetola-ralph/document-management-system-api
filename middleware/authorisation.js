'use strict';
const models     = require('./../models/index.js');
const roleModel  = models.Roles;

const authorize = (req, res, next) => {
  const decoded = req.decoded;
  const roleId = decoded.roleId;

  roleModel.findOne({
    where: {
      id: roleId
    }
  }).then((role) => {
    if (role) {
      if (role.title === 'admin') {
        next();
      } else {
        res.status(403)
          .json({
            success: 'false',
            message: 'Not authorised to perform this action'
          });
      }
    } else {
      res.status(403)
        .json({
          success: 'false',
          message: 'Invalid role'
        });
    }
  }).catch(() => {
    res.status(500)
      .json({
        success: 'false',
        message: 'server error'
      });
  });
};

module.exports = authorize;
