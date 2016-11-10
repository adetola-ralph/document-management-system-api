const userHelper = {
  checkDetails: (req, res) => {
    let user = req.body;
    if (!(user.firstname && user.lastname && user.username
      && user.password && user.roleId && user.email)) {
      res.status(400)
        .json({
          success: false,
          message: 'All fields must be filled'
        });
      res.end();
    }
  }
};

module.exports = userHelper;
