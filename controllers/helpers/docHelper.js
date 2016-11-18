const docHelper = {
  checkDocDetails: (req, res) => {
    const document = req.body;
    if (!(document.title && document.content && document.access)) {
      res.status(400)
        .json({
          success: false,
          message: 'All fields must be filled'
        });
      res.end();
      return true;
    }
  },
  queryBuilder: (reqQuery) => {
    const dbQuery = {
      order: [['createdAt', 'DESC']]
    };

    const queries = Object.keys(reqQuery);

    if (queries.indexOf('offset') > -1) {
      dbQuery.offset = reqQuery.offset;
    }
    if (queries.indexOf('limit') > -1) {
      dbQuery.limit = reqQuery.limit;
    }
    if (queries.indexOf('date') > -1) {
      const nextDate = new Date(reqQuery.date);

      dbQuery.where = {
        createdAt: {
          $lt: new Date(new Date(nextDate.setDate(nextDate.getDate() + 1))),
          $gt: new Date(new Date(reqQuery.date) - 1)
        }
      };
    }

    return dbQuery;
  }
};

module.exports = docHelper;
