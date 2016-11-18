const models = require('./../models/index');

const user = models.Users;
const role = models.Roles;

const roleData = [
  { title: 'admin' },
  { title: 'normal' },
  { title: 'guest' }
];

const userData = [
  {
    firstname: 'Adunoluwa',
    lastname: 'Olutola',
    username: 'adun_luwa',
    email: 'adunoluwa1@oreofe.me',
    password: 'Adunoluwa95#',
    roleId: 1
  }
];

role.bulkCreate(roleData).then(() => {
  user.bulkCreate(userData).then(() => {
  }).catch((err) => {
    console.err(err);
  });
}).catch((err) => {
  console.err(err);
});
