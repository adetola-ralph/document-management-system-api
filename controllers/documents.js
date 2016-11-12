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

  },
  getUserDoc: (req, res) => {
    const decoded = req.decoded;
    const uid = req.params.uid;
    const userRoleId = decoded.roleId;

    models.Roles.findOne({
      where: {
        id: userRoleId
      }
    }).then((role) => {
      if(!role) {
        res.status(404).json({
          success: false,
          message: 'Role doesn\'t exists'
        });
      } else {
        if (decoded.id === Number(uid) || role.title === 'admin') {
          docModel.findAll({
            where: {
              ownerId: uid
            }
          }).then((documents) => {
            if(documents.length > 0) {
              res.status(200).json({
                success: true,
                message: 'Documents retrieved',
                data: documents
              });
            } else {
              res.status(200).json({
                success: true,
                message: 'User doesn\'t have any document',
                data: []
              });
            }
          }).catch(() => {
            res.status(500).json({
              success: false,
              message: 'Server error'
            });
          });
        } else {
          res.status(403).json({
            success: false,
            message: 'You\'re not authorised to do this'
          })
        }
      }
    }).catch(() => {
      res.status(500).json({
        success: false,
        message: 'Server error'
      })
    });


  }
};

module.exports = documents;
