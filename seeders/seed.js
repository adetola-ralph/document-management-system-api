import winston from 'winston';
import models from './../models/';

const user = models.Users;
const role = models.Roles;

// default roles present in the application
const roleData = [
  { title: 'admin' },
  { title: 'normal' },
  { title: 'guest' }
];

// first iser in the databse
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

// bulk adds the role and user objects into the databse
role.bulkCreate(roleData).then(() => {
  user.bulkCreate(userData).then(() => {
  }).catch((err) => {
    winston.log('error', err);
  });
}).catch((err) => {
  winston.log('error', err);
});
