'use strict';

const models = require('./../models/');
const jwt    = require('jsonwebtoken');
const dotenv = require('dotenv');

const secret = process.env.SECRET;

const authenticate = {
  signin: (req, res) => {

  },
  signout: (req, res) => {

  }
};

module.exports = authenticate;
