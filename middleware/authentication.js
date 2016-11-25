import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ silent: true });

const secret = process.env.SECRET;

export default class Authentication {
  static checkAuthentication(req, res, next) {
    // Get the token for request
    const token = req.body.token || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          res.status(403).json({
            success: false,
            message: 'Invalid token'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
        success: false,
        message: 'Token not provided'
      });
    }
  }
}
