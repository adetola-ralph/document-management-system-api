'use strict';
const models = require('./../models/index');
const user = models.Users;
const role = models.Roles;

const roleData = [
  { title: 'admin' },
  { title: 'normal' },
  { title: 'guest' }
];

const userData = [
  { firstname: 'Adunoluwa', lastname: 'Olutola', username: 'adun_luwa',
    email: 'adunoluwa1@oreofe.me', password: 'Adunoluwa95#', roleId: 1
  }
];

role.bulkCreate(roleData).then((role) => {
  user.bulkCreate(userData).then((user)=> {
  }).catch((err, res) => {
    console.err(err);
  });
}).catch((err, res) => {
  console.err(err);
});
