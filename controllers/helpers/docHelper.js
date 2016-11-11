const docHelper = {
  checkDocDetails: (req, res) => {
    let document = req.body;
    if (!(document.title && document.content && document.access)) {
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

module.exports = docHelper;
