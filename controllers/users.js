const models = require('./../models/');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({ silent: true });
const userHelper = require('./helpers/userHelpers.js');

const secret = process.env.SECRET;
const userModel = models.Users;


const usersCtr = {
  index: (req, res) => {
    userModel.findAll()
      .then((users) => {
        res.status(200)
          .json({
            success: true,
            message: 'All users retrieved',
            data: users
          });
      })
      .catch(() => {
        res.status(500)
          .json({
            success: false,
            message: 'Server error'
          });
      });
  },
  // called for signup
  create: (req, res) => {
    const user = req.body;
    if (!userHelper.checkDetails(req)) {
      res.status(400)
        .json({
          success: false,
          message: 'All fields must be filled'
        });
    } else {
      if (user.roleId === 1) {
        const token = req.headers['x-access-token'];
        const decoded = jwt.verify(token, secret);

        if (decoded && decoded.roleId !== 1) {
          res.status(403)
            .json({
              success: 'false',
              message: 'You must be an admin user to create another admin user'
            });
          res.end();
        }
      } else {
        userModel
          .findOne({
            where: {
              $or: [{ username: user.username }, { email: user.email }]
            }
          }).then((result) => {
            if (!result) {
              userModel
                .create(user)
                .then((newUser) => {
                  res.status(201).json({
                    success: true,
                    message: 'User created',
                    data: newUser
                  });
                });
            } else {
              res.status(409).json({
                success: false,
                message: 'User already exists'
              });
            }
          }).catch(() => {
            res.status(500).json({
              success: false,
              message: 'Server error'
            });
          });
      }
    }
  },

  show: (req, res) => {
    const userId = req.params.id;
    const decoded = req.decoded;

    models.Roles.findOne({
      where: {
        id: decoded.roleId
      }
    }).then((role) => {
      if (role) {
        if (decoded.id === Number(userId) || role.title === 'admin') {
          userModel
            .findOne({
              where: {
                id: userId
              }
            }).then((user) => {
              if (user) {
                res.status(200).json({
                  success: true,
                  message: 'User retrieved',
                  data: user
                });
              }
            });
        } else {
          res.status(403).json({
            success: false,
            message: 'You\'re not allowed to perform this action'
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: 'Role does not exist'
        });
      }
    }).catch(() => {
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    });
  },
  update: (req, res) => {
    const userId = req.params.id;
    const decoded = req.decoded;

    models.Roles.findOne({
      where: {
        id: decoded.roleId
      }
    }).then((role) => {
      if (role) {
        if (decoded.id === Number(userId) || role.title === 'admin') {
          userModel.update(req.body, {
            where: {
              id: userId
            },
            returning: true,
            plain: true
          }).then((updatedUser) => {
            res.status(200).json({
              success: true,
              message: 'User detail update',
              data: updatedUser[1].dataValues
            });
          }).catch((err) => {
            res.status(500).json({
              success: false,
              message: 'Update failed',
              data: err
            });
          });
        } else {
          res.status(403).json({
            success: false,
            message: 'You\'re not allowed to perform this action'
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: 'Role does not exist'
        });
      }
    }).catch(() => {
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    });
  },
  delete: (req, res) => {
    const userId = req.params.id;

    if (userId === req.decoded.id) {
      res.status(403).json({
        success: false,
        message: 'You\'re not allowed to perform this action'
      });
    } else {
      userModel.destroy({
        where: {
          id: userId
        }
      }).then((result) => {
        if (result > 0) {
          res.status(200).json({
            success: true,
            message: 'User deleted'
          });
        } else {
          res.status(404).json({
            success: false,
            message: 'User doesn\'t exist'
          });
        }
      }).catch(() => {
        res.status(500).json({
          success: false,
          message: 'Server error'
        });
      });
    }
  }
};

module.exports = usersCtr;
