export default class userHelper{
  static checkDetails(req) {
    const user = req.body;
    if (!(user.firstname && user.lastname && user.username
      && user.password && user.roleId && user.email)) {
      return false;
    }
    return true;
  }
}
