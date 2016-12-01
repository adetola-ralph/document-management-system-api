import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserHelper from './helpers/userHelpers';
import models from './../models/';

dotenv.config({ silent: true });
const secret = process.env.SECRET;
const userModel = models.Users;

 /**
  * UserController
  *
  * controller class that handles actions to be taken out on the user resource
  */
export default class UserController {

  constructor() {
    this.create = this.create.bind(this);
    this.index = this.index.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.get = this.get.bind(this);
    this.createUser = this.createUser.bind(this);
  }
  /**
   * Index
   *
   * index method gets all the users in the database if the requester is
   * authorised
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  index(req, res) {
    userModel.findAll()
      .then((users) => {
        res.status(200)
          .json({
            success: true,
            message: 'All users retrieved',
            data: users
          });
      })
      .catch((err) => {
        res.status(500)
          .json({
            success: false,
            message: 'Server error',
            error: err
          });
      });
  }


  /**
   * Create
   *
   * create method adds a new user to the application. Note that only admin
   * users can create another admin user
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  create(req, res) {
    const user = req.body;
    if (!UserHelper.checkDetails(req)) {
      return res.status(400)
        .json({
          success: false,
          message: 'All fields must be filled'
        });
    } else if (user.roleId) {
      models.Roles.findById(user.roleId).then((role) => {
        if (!role) {
          return res.status(400)
            .json({
              success: false,
              message: 'Please select a valid role'
            });
        } else if (role.title === 'admin') {
          const token = req.headers['x-access-token'];
          if (token) {
            const decoded = jwt.verify(token, secret);
            if (decoded && decoded.roleId !== user.roleId) {
              return res.status(403)
                .send({
                  success: false,
                  message: 'You must be an admin user to create another admin user'
                });
            } else {
              this.createUser(user, res);
            }
          } else {
            return res.status(403)
              .send({
                success: false,
                message: 'You must be an admin user to create another admin user'
              });
          }
        } else {
          this.createUser(user, res);
        }
      });
      return;
    } else {
      this.createUser(user, res);
    }
  }

  /**
   * Get
   *
   * get method returns a user matching the id parameter sent in the request
   * string. A non-admin user can only view their own user information
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  get(req, res) {
    const userId = req.params.id;
    const decoded = req.decoded;

    models.Roles.findById(decoded.roleId).then((role) => {
      if (decoded.id === Number(userId) || role.title === 'admin') {
        userModel
          .findById(userId).then((user) => {
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
   * update method handles changing and updating users information in the
   * database. Note that a non-admin user can only update their own details
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  update(req, res) {
    const userId = req.params.id;
    const decoded = req.decoded;

    models.Roles.findById(decoded.roleId).then((role) => {
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
            error: err
          });
        });
      } else {
        res.status(403).json({
          success: false,
          message: 'You\'re not allowed to perform this action'
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
   * Delete
   *
   * delete method removes a user from the database. This action can only be
   * carried out by an admin user.
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  delete(req, res) {
    const userId = req.params.id;
    const decoded = req.decoded;

    models.Roles.findById(decoded.roleId).then((role) => {
      if (decoded.id === Number(userId) || role.title === 'admin') {
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
          message: 'Not authorised to perform this action'
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

  createUser(user, res) {
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
      }).catch((err) => {
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: err
        });
      });
  }
}
