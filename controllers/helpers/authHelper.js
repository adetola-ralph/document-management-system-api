const authHelper = {
  checkLoginDetails: (req) => {
    const user = req.body;
    if (!(user.username && user.password)) {
      return false;
    }
    return true;
  }
};

module.exports = authHelper;
