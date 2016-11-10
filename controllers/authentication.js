'use strict';

const models     = require('./../models/');
const userModel  =models.Users;
const jwt        = require('jsonwebtoken');
const dotenv     = require('dotenv').config();
const bcrypt     = require('bcryptjs');

const authHelper = require('./helpers/authHelper.js');
const secret     = process.env.SECRET;

const authenticate = {
  signin: (req, res) => {
    if (authHelper.checkLoginDetails(req, res)) {
      return;
    }

    const username = req.body.username;
    const password = req.body.password;

    userModel.findOne({
      where: {
        'username': username
      }
    }).then((user) => {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign(user.dataValues, secret, {
            expiresIn: '24h'
          });
          res.status(200).json({
            success: true,
            message: 'Authentication successful',
            data: token
          });
        } else {
          res.status(403).json({
            success: false,
            message: 'Authentication failed: Wrong password'
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: 'Authentication failed: User not found'
        });
      }
    }).catch(() => {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    });
  },
  signout: (req, res) => {

  }
};

module.exports = authenticate;
