import models from './../models/';

const roleModel = models.Roles;

/**
* Authorisation
*
* authorisation middleware deals with checking if the user is authorised to
* access a resource
*/
export default class Authorisation {

  /**
   * Check Authorisation
   *
   * checkAuthorisation deals with checking if the user trying to access a
   * resource is an admin or not
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @param  {function} next function that indicates if the request moves beyond
   * the middleware or not
   * @return {null} doesn't return anything
   */
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
