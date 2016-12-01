/**
 * DocHelper
 *
 * helper class for Document controller that handles non-controller
 * relatd tasks
 */
export default class DocHelper {
  /**
   * Check Doc Details
   *
   * static method that check if the all the necessary fiels for document
   * creation exists
   *
   * @param  {Object} req Express request object
   * @return {Boolean}     returns true if all the fields are present and
   * false otherwise
   */
  static checkDocDetails(req) {
    const document = req.body;
    if (!(document.title && document.content)) {
      return false;
    }
    if (document.access && !(document.access === 'public' || document.access === 'private' || document.access === 'role')) {
      return false
    }
    return true;
  }

  /**
   * Query Builder
   *
   * takes the queries from the request link and builds a query sequelize
   * can use to query the databse
   *
   * @param  {Object} reqQuery contains a list of queries that have been sent
   * alongside the the document resource request link
   *
   * @return {Object} dbQuery dqQuery is an object that can be used by
   * sequelize to query the postgres db
   */
  static queryBuilder(reqQuery) {
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
    if (queries.indexOf('role') > -1) {
      dbQuery.ownerRoleId = reqQuery.role;
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
}
