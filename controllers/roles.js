const models = require('./../models/');

const rolesCtr = {
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
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: err
        });
      });
  },
  show: (req, res) => {
    const roleId = req.params.id;
    models
      .Roles
      .findById(roleId).then((role) => {
        if (!role) {
          res.status(404).json({
            success: false,
            message: 'Role does not exist'
          });
        } else {
          res.status(200).json({
            success: true,
            message: 'role retreived',
            data: role
          });
        }
      }).catch((err) => {
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: err
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
            .Roles.create({ title: roleTitle })
            .then((newRole) => {
              res.status(201).json({
                success: true,
                message: `${roleTitle} role created successfully`,
                data: newRole
              });
            })
            .catch((err) => {
              res.status(500).json({
                success: false,
                message: 'Server error',
                error: err
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
      .findById(roleId).then((role) => {
        if (!role) {
          res.status(404).json({
            success: false,
            message: 'Role does not exist'
          });
        } else {
          models
            .Roles
            .update({ title: updatedTitle }, {
              where: {
                id: roleId
              }
            })
            .then(() => {
              res.status(200).json({
                success: true,
                message: 'updated successfully'
              });
            }).catch((err) => {
              res.status(500).json({
                success: false,
                message: 'Server error',
                error: err
              });
            });
        }
      }).catch((err) => {
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: err
        });
      });
  },
  delete: (req, res) => {

  }
};

module.exports = rolesCtr;
