import dotenv from 'dotenv';
import DocHelper from './helpers/docHelper';
import models from './../models/';

dotenv.config({ silent: true });

const docModel = models.Documents;

/**
 * Documents controller
 *
 * controller class that handles all actions to be carried out on the document
 * resource
 */
export default class DocumentsController {

  /**
   * Index
   *
   * index method gets all the documents in the database based on the requesters
   * role and queries fed to it
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  index(req, res) {
    const decodedUser = req.decoded;
    const queries = req.query;
    const dbQuery = DocHelper.queryBuilder(queries);

    models.Roles
      .findById(decodedUser.roleId)
      .then((role) => {
        if (role.title !== 'admin') {
          dbQuery.where = dbQuery.where || {};
          dbQuery.where.$or = [{
            access: 'public'
          }, {
            ownerId: decodedUser.id
          }];
        }

        if (role.title !== 'admin') {
          dbQuery.where = dbQuery.where || {};
          dbQuery.where.$or = [{
            access: 'public'
          }, {
            ownerId: decodedUser.id
          }];
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
              res.status(404).json({
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
      }).catch((err) => {
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: err
        });
      });
  }

  /**
   * Create
   *
   * create method creates a document for the requester
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  create(req, res) {
    const decodedUser = req.decoded;
    const document = req.body;

    if (!DocHelper.checkDocDetails(req, res)) {
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
  }

  /**
   * Show
   *
   * show method gets a document from the databse based on the id supplied
   * to the method and the role of the requester
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  show(req, res) {
    const decodedUser = req.decoded;
    const docId = req.params.id;

    docModel.findById(docId).then((document) => {
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
  }

  /**
   * Update
   *
   * update method updates the details of a document depending on the
   * role of the requester or if the requester is the documents owner
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  update(req, res) {
    const decodedUser = req.decoded;
    const docEdit = req.body;
    const docId = req.params.id;

    models.Roles.findById(decodedUser.roleId)
      .then((role) => {
        docModel.findById(docId).then((document) => {
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
      }).catch((err) => {
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: err
        });
      });
  }

  /**
   * Delete
   *
   * delete method removes a document from the databse depending on the role of
   * the requester and if the requester is the creator of the document
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  delete(req, res) {
    const decodedUser = req.decoded;
    const docId = req.params.id;

    models.Roles.findById(decodedUser.roleId)
      .then((role) => {
        docModel.findById(docId).then((document) => {
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
      }).catch((err) => {
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: err
        });
      });
  }

  /**
   * Get User Doc
   *
   * gets all documents relating to a particular use, it returns the documents
   * depending on the role of the requester or if the requester is the same
   * as the user whose documents are being requested
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  getUserDoc(req, res) {
    const decoded = req.decoded;
    const uid = req.params.uid;
    const userRoleId = decoded.roleId;

    models.Roles.findById(userRoleId).then((role) => {
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
            res.status(404).json({
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
    }).catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: err
      });
    });
  }
}
