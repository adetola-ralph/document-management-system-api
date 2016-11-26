
/**
 * User helper
 *
 * a helper class for User controller that carried out non-controller
 * related tasks
 */
export default class userHelper{

  /**
   * Check Details
   *
   * static method that checks if all the fields necessary for user creation
   * are present
   *
   * @param  {Object} req Express request object
   * @return {Boolean}     returns true if all the fields are present and false
   * otherwise
   */
  static checkDetails(req) {
    const user = req.body;
    if (!(user.firstname && user.lastname && user.username
      && user.password && user.roleId && user.email)) {
      return false;
    }
    return true;
  }
}
