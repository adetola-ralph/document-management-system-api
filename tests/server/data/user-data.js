module.exports = {
  // user with normal role 1
  normalUser1: {
    firstname: 'Oreofeoluwapo',
    lastname: 'Olutola',
    username: 'adetolaraphael',
    email: 'oreofe.olutola@gmail.com',
    password: 'Pasword1234',
    roleId: 2
  },
  // user with normal role 2
  normalUser2: {
    firstname: 'Winner',
    lastname: 'Bolorunduro',
    username: 'winner-timothy',
    email: 'winner-timothy@gmail.com',
    password: 'Pasword12345',
    roleId: 2
  },
  // administatrive role
  adminUser: {
    firstname: 'Terwase',
    lastname: 'Gberikon',
    username: 'mrgberikon',
    email: 'mrgberikon@gmail.com',
    password: 'Pasword12345',
    roleId: 1
  },
  // incomplete user details
  invalidUSer1: {
    firstname: '',
    lastname: 'Gberikon',
    username: 'tgberikon',
    email: 'terwase@gmail.com',
    password: 'Pasword12345',
    roleId: 1
  },
  // invalid role id
  invalidUser2: {
    firstname: 'Terwase',
    lastname: 'Gberikon',
    username: 'gberikon',
    email: 'gberikon@gmail.com',
    password: 'Pasword12345',
    roleId: 6
  },
  // duplicate username
  duplicateUser1: {
    firstname: 'Verems',
    lastname: 'Gberikon',
    username: 'adetolaraphael',
    email: 'gberikon@gmail.com',
    password: 'Pasword12345',
    roleId: 2
  },
  // duplicate email
  duplicateUser2: {
    firstname: 'random',
    lastname: 'dude',
    username: 'random.dude',
    email: 'oreofe.olutola@gmail.com',
    password: 'Pasword1234',
    roleId: 2
  },
};