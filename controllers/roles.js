import models from './../models/';

 /**
  * RoleController
  *
  * controller class that handles all actions concerning roles resource
  */
export default class RoleController {
  /**
   * Index
   *
   * index method allows only authorised users (admin role) to get all the
   * roles from the db
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  index(req, res) {
    models
      .Roles
      .findAll()
      .then((roles) => {
        res.status(200).json({
          success: true,
          message: 'All roles',
          data: roles
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: err
        });
      });
  }

  /**
   * Show
   *
   * show method gets a role from the db depending on the id given in the link
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  show(req, res) {
    const roleId = req.params.id;
    models
      .Roles
      .findById(roleId).then((role) => {
        if (!role) {
          res.status(404).json({
            success: false,
            message: 'Role does not exist'
          });
        } else {
          res.status(200).json({
            success: true,
            message: 'role retreived',
            data: role
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
   * Create
   *
   * create method allows authorised users to create new roles
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  create(req, res) {
    const roleTitle = req.body.title || req.query.title;
    if (!roleTitle) {
      res.status(403).json({
        success: false,
        message: 'Title cannot be empty'
      });
    } else {
      models
        .Roles.findOne({
          where: {
            title: roleTitle
          }
        }).then((role) => {
          if (!role) {
            models
            .Roles.create({ title: roleTitle })
            .then((newRole) => {
              res.status(201).json({
                success: true,
                message: `${roleTitle} role created successfully`,
                data: newRole
              });
            })
            .catch((err) => {
              res.status(500).json({
                success: false,
                message: 'Server error',
                error: err
              });
            });
          } else {
            res.status(409).json({
              success: false,
              message: `${roleTitle} role exists`,
            });
          }
        });
    }
  }

  /**
   * Update
   *
   * update method allows for changing and updating details of an existing role
   *
   * @param  {Object} req express request object that is received from
   * the requester
   * @param  {Object} res express response object that gets sent back to
   * the requester
   * @return {null} doesn't return anything
   */
  update(req, res) {
    const updatedTitle = req.body.title;
    const roleId = req.params.id;
    models
      .Roles
      .findById(roleId).then((role) => {
        if (!role) {
          res.status(404).json({
            success: false,
            message: 'Role does not exist'
          });
        } else {
          models
            .Roles
            .update({ title: updatedTitle }, {
              where: {
                id: roleId
              }
            })
            .then(() => {
              res.status(200).json({
                success: true,
                message: 'updated successfully'
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

  delete(req, res) {
    const roleId = req.params.id;

    models
      .Roles
      .destroy({
        where: {
          id: roleId
        }
      })
      .then((result) => {
        if (result > 0) {
          res.status(200).json({
            success: true,
            message: 'Role deleted'
          });
        } else {
          res.status(404).json({
            success: false,
            message: 'Role doesn\'t exist'
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
