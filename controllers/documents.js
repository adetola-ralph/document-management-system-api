const models = require('./../models/');
const dotenv = require('dotenv').config({ silent: true });
const docHelper = require('./helpers/docHelper.js');

const docModel = models.Documents;

const documentsCtr = {
  index: (req, res) => {
    const decodedUser = req.decoded;
    const queries = req.query;
    const dbQuery = docHelper.queryBuilder(queries);

    models.Roles
      .findById(decodedUser.roleId)
      .then((role) => {
        if (role) {
          if (role.title !== 'admin') {
            if (dbQuery['where']) {
              dbQuery['where']['$or'] = [
                { access: 'public' },
                { ownerId: decodedUser.id }
              ];
            } else {
              dbQuery.where = {
                $or: [
                  { access: 'public' },
                  { ownerId: decodedUser.id },
                ]
              };
            }
          }

          docModel.findAll(dbQuery)
            .then((documents) => {
              if (documents.length > 0) {
                res.status(200).json({
                  success: true,
                  message: 'Documents retreived',
                  data: documents
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: 'No documents available',
                  data: []
                });
              }
            }).catch((err) => {
              res.status(500).json({
                success: false,
                message: 'Server error',
                error: err
              });
            });
        } else {
          res.status(404).json({
            success: false,
            message: 'Role not found'
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
    const decodedUser = req.decoded;
    const document = req.body;

    if (!docHelper.checkDocDetails(req, res)) {
      res.status(400)
        .json({
          success: false,
          message: 'All fields must be filled'
        });
    } else {
      docModel.findOne({
        where: {
          title: document.title
        }
      }).then((doc) => {
        if (doc) {
          res.status(409).json({
            success: false,
            message: 'A document with the title exists'
          });
        } else {
          document.ownerId = decodedUser.id;
          document.ownerRoleId = decodedUser.roleId;

          docModel.create(document).then((newDoc) => {
            res.status(201).json({
              success: true,
              message: 'Document created',
              data: newDoc
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
    }
  },
  show: (req, res) => {
    const decodedUser = req.decoded;
    const docId = req.params.id;

    docModel.findOne({
      where: {
        id: docId
      }
    }).then((document) => {
      if (document) {
        if (document.ownerId === decodedUser.id || document.access === 'public') {
          res.status(200).json({
            success: true,
            message: 'Document found',
            data: document
          });
        } else {
          models.Roles.findById(decodedUser.roleId)
            .then((role) => {
              if (role) {
                if (role.title === 'admin') {
                  res.status(200).json({
                    success: true,
                    message: 'Document found',
                    data: document
                  });
                } else if (document.access === 'role') {
                  models.Users.findById(document.ownerId)
                    .then((user) => {
                      if (user.roleId === decodedUser.roleId) {
                        res.status(200).json({
                          success: true,
                          message: 'Document found',
                          data: document
                        });
                      } else {
                        res.status(403).json({
                          success: false,
                          message: 'You\'re not authorised to access this document'
                        });
                      }
                    }).catch((err) => {
                      res.status(500).json({
                        success: false,
                        message: 'Server error',
                        error: err
                      });
                    });
                } else {
                  res.status(403).json({
                    success: false,
                    message: 'You\'re not authorised to access this document'
                  });
                }
              } else {
                res.status(404).json({
                  success: false,
                  message: 'Role not found'
                });
              }
            }).catch((err) => {
              res.status(500).json({
                success: false,
                message: 'Server error',
                error: err
              });
            });
        }
      } else {
        res.status(404).json({
          success: false,
          message: 'Document doesn\'t exist'
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
  update: (req, res) => {
    const decodedUser = req.decoded;
    const docEdit = req.body;
    const docId = req.params.id;

    models.Roles.findById(decodedUser.roleId)
    .then((role) => {
      if (role) {
        docModel.findOne({
          where: {
            id: docId
          }
        }).then((document) => {
          if (role.title === 'admin' || document.ownerId === decodedUser.id) {
            docModel.update(docEdit, {
              where: {
                id: docId
              },
              returning: true,
              plain: true
            }).then((updatedDocument) => {
              res.status(200).json({
                success: true,
                message: 'Document updated',
                data: updatedDocument[1].dataValues
              });
            }).catch((err) => {
              res.status(500).json({
                success: false,
                message: 'Server error',
                error: err
              });
            });
          } else {
            res.status(403).json({
              success: false,
              message: 'You\'re not authorised to perform this action'
            });
          }
        }).catch((err) => {
          res.status(500).json({
            success: false,
            message: 'Server error',
            error: err
          });
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Role not found'
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
    const decodedUser = req.decoded;
    const docId = req.params.id;

    models.Roles.findById(decodedUser.roleId)
    .then((role) => {
      if (role) {
        docModel.findOne({
          where: {
            id: docId
          }
        }).then((document) => {
          if (role.title === 'admin' || document.ownerId === decodedUser.id) {
            docModel.destroy({
              where: {
                id: docId
              }
            }).then((result) => {
              if (result > 0) {
                res.status(200).json({
                  success: true,
                  message: 'Document deleted'
                });
              } else {
                res.status(404).json({
                  success: false,
                  message: 'Document doesn\'t exist'
                });
              }
            }).catch((err) => {
              res.status(500).json({
                success: false,
                message: 'Server error',
                error: err
              });
            });
          } else {
            res.status(403).json({
              success: false,
              message: 'You\'re not authorised to perform this action'
            });
          }
        }).catch((err) => {
          res.status(500).json({
            success: false,
            message: 'Server error',
            error: err
          });
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Role not found'
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
  getUserDoc: (req, res) => {
    const decoded = req.decoded;
    const uid = req.params.uid;
    const userRoleId = decoded.roleId;

    models.Roles.findOne({
      where: {
        id: userRoleId
      }
    }).then((role) => {
      if (!role) {
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
            if (documents.length > 0) {
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
          });
        }
      }
    }).catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: err
      });
    });
  }
};

module.exports = documentsCtr;
