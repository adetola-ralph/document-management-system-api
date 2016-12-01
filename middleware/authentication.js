import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ silent: true });
const secret = process.env.SECRET;


/**
* Authentication
*
* authenication middleware deals with checking for authentication
*/
export default class Authentication {

  /**
   * Check Authentication
   *
   * checkAuthentication method checks if the user trying to access a route has
   * been authenticated and the request contains a valid jwt token
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @param  {function} next function that indicates if the request moves beyond
   * the middleware or not
   * @return {null} doesn't return anything
   */
  static checkAuthentication(req, res, next) {
    const token = req.body.token || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          res.status(401).json({
            success: false,
            message: 'Invalid token'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(401).send({
        success: false,
        message: 'Token not provided'
      });
    }
  }
}
