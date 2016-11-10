const authHelper = {
  checkLoginDetails: (req, res) => {
    let user = req.body;
    if (!(user.username && user.password)) {
      res.status(400)
        .json({
          success: false,
          message: 'All fields must be filled'
        });
      res.end();
      return true;
    }
  }
};

module.exports = authHelper;
