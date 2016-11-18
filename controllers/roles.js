'use strict';

const models = require('./../models/');

const roles = {
  index: (req, res) => {
    models
      .Roles
      .findAll()
      .then((roles) => {
        res.status(200).json({
          success: true,
          message: 'All roles',
          data: roles
        });
      })
      .catch(() => {
        res.status(500).json({
          success: false,
          message: 'An error occured in the server'
        });
      });
  },
  show: (req, res) => {
    const roleId = req.params.id;
    models
      .Roles
      .findOne({
        where: {
          id: roleId
        }
      }).then((role) => {
        if (!role) {
          res.status(404).json({
            success: false,
            message: 'role does not exist'
          });
        }else{
          res.status(200).json({
            success: true,
            message: 'role retreived',
            data: role
          });
        }
      }).catch(() => {
        res.status(500).json({
          success: false,
          message: 'server error'
        });
      });
  },
  create: (req, res) => {
    const roleTitle = req.body.title || req.query.title;
    if (!roleTitle) {
      res.status(403).json({
        success: false,
        message: 'Title cannot be empty'
      });
    } else {
      models
        .Roles.findOne({
          where: {
            title: roleTitle
          }
        }).then((role) => {
          if (!role) {
            models
            .Roles.create({title: roleTitle})
            .then((newRole) => {
              res.status(201).json({
                success: true,
                message: `${roleTitle} role created successfully`,
                data: newRole
              });
            })
            .catch(() => {
              res.status(500).json({
                success: false,
                message: 'An error occured in the server'
              });
            });
          } else {
            res.status(409).json({
              success: false,
              message: `${roleTitle} role exists`,
            });
          }
        });
    }
  },
  update: (req, res) => {
    const updatedTitle = req.body.title;
    const roleId = req.params.id;
    models
      .Roles
      .findOne({
        where: {
          id: roleId
        }
      }).then((role) => {
        if (!role) {
          res.status(404).json({
            success: false,
            message: 'role does not exist'
          });
        }else{
          models
            .Roles
            .update({title: updatedTitle},{
              where: {
                id: roleId
              }
            })
            .then((updatedRole) => {
              res.status(200).json({
                success: true,
                message: 'updated successfully'
              });
            }).catch(() => {
              res.status(500).json({
                success: false,
                message: 'server error'
              });
            });
        }
      }).catch(() => {
        res.status(500).json({
          success: false,
          message: 'server error'
        });
      });
  },
  delete: (req, res) => {

  }
}

module.exports = roles;
