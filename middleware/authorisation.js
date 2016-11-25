import models from './../models/';

const roleModel = models.Roles;

export default class Authorisation {
  static checkAuthorisation(req, res, next) {
    const decoded = req.decoded;
    const roleId = decoded.roleId;

    roleModel.findById(roleId).then((role) => {
      if (role) {
        if (role.title === 'admin') {
          next();
        } else {
          res.status(403)
            .json({
              success: false,
              message: 'Not authorised to perform this action'
            });
        }
      } else {
        res.status(403)
          .json({
            success: false,
            message: 'Invalid role'
          });
      }
    }).catch((err) => {
      res.status(500)
        .json({
          success: false,
          message: 'Server error',
          error: err
        });
    });
  }
}
