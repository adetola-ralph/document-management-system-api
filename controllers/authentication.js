import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import AuthHelper from './helpers/authHelper';
import models from './../models/';

dotenv.config({ silent: true });

const secret = process.env.SECRET;
const userModel = models.Users;


/**
 * Authentication Controller
 *
 * controller class that handles the login for anything relating to user
 * authentication
 */
export default class AuthenticationController {
  /**
   * Signin
   *
   * signin method that handles users signing in to the application
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  signin(req, res) {
    if (!AuthHelper.checkLoginDetails(req)) {
      res.status(400)
        .json({
          success: false,
          message: 'All fields must be filled'
        });
    } else {
      const username = req.body.username;
      const password = req.body.password;

      userModel.findOne({
        where: {
          username
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
      }).catch((err) => {
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: err
        });
      });
    }
  }
}
