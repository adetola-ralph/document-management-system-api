'use strict';

const models     = require('./../models/');
const docModel   = models.Documents;
const dotenv     = require('dotenv').config();
const docHelper  = require('./helpers/docHelper.js');

const documents = {
  index: (req, res) => {

  },
  create: (req, res) => {
    const decodedUser = req.decoded;
    const document = req.body;

    if (docHelper.checkDocDetails(req, res)) {
      return;
    }

    docModel.findOne({
      where: {
        title: document.title
      }
    }).then((doc) => {
      if (doc) {
        res.status(409).json({
          success: false,
          message: 'A document wih the title exists'
        });
      } else {
        document.ownerId = decodedUser.id;
        docModel.create(document).then((newDoc) => {
          res.status(201).json({
            success: true,
            message: 'Document created',
            data: newDoc
          });
        }).catch(() => {
          res.status(500).json({
            success: false,
            message: 'Server error'
          });
        });
      }
    }).catch(() => {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    });

  },

  show: (req, res) => {

  },
  update: (req, res) => {

  },
  delete: (req, res) => {

  }
};

module.exports = documents;
