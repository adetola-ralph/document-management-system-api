/**
 * AuthHelper
 *
 * class that helps the Authentication controller with non-controller
 * related tasks
 */
export default class AuthHelper {
  /**
   * Check Login Details
   *
   * static method of AuthHelper class that checks if the login data sent
   * contains all the necessary fields
   *
   * @param  {Object} req express static request object from the calling
   * controller method
   * @return {boolean} returns true if all the fields are present and false
   * otherwise
   */
  static checkLoginDetails(req) {
    const user = req.body;
    if (!(user.username && user.password)) {
      return false;
    }
    return true;
  }
}
