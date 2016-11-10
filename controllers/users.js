'use strict';

const models     = require('./../models/');
const userModel  = models.Users;
const jwt        = require('jsonwebtoken');
const dotenv     = require('dotenv').config();
const userHelper = require('./helpers/userHelpers.js');

const secret     = process.env.SECRET;

const users = {
  index: (req, res) => {

  },
  // called for signup
  create: (req, res) => {
    let user = req.body;
    if (userHelper.checkDetails(req, res)) {
      return;
    }

    if (user.roleId === 1) {
      const token = req.headers['x-access-token'];
      const decoded = jwt.verify(token, secret);

      if (decoded && decoded.roleId !== '1') {
        res.status(403)
          .json({
            success: 'false',
            message: 'You must be an admin user to create another admin user'
          });
        res.end();
        return;
      }
    }

    userModel
      .findOne({
        where: {
          $or: [{username: user.username}, {email: user.email}]
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
            })
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
};

module.exports = users;
