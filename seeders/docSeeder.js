'use strict';
const models = require('./../models/index');
const doc = models.Documents;

const docData = [
  {
    title: 'document 1',
    content: 'document 1 contents',
    access: 'private',
    ownerId: 3,
    ownerRoleId: 2
  },
  {
    title: 'document 2',
    content: 'document 2 contents',
    access: 'role',
    ownerId: 3,
    ownerRoleId: 2
  },
  {
    title: 'document 3',
    content: 'document 3 contents',
    access: 'private',
    ownerId: 3,
    ownerRoleId: 2
  },
  {
    title: 'document 4',
    content: 'document 4 contents',
    access: 'public',
    ownerId: 3,
    ownerRoleId: 2
  },
  {
    title: 'document 5',
    content: 'document 5 contents',
    access: 'private',
    ownerId: 2,
    ownerRoleId: 2
  },
  {
    title: 'document 6',
    content: 'document 6 contents',
    access: 'role',
    ownerId: 2,
    ownerRoleId: 2
  },
  {
    title: 'document 7',
    content: 'document 7 contents',
    access: 'private',
    ownerId: 2,
    ownerRoleId: 2
  },
  {
    title: 'document 8',
    content: 'document 8 contents',
    access: 'public',
    ownerId: 2,
    ownerRoleId: 2
  },
  {
    title: 'document 9',
    content: 'document 9 contents',
    access: 'public',
    ownerId: 3,
    ownerRoleId: 2
  },
  {
    title: 'document 10',
    content: 'document 10 contents',
    access: 'public',
    ownerId: 3,
    ownerRoleId: 2
  }
];

const docSeeder  = {
  startSeed: () => {
    doc.bulkCreate(docData).then(() => {
      console.log('Document table seeded');
    }).catch((err) => {
      console.err(err);
    });
  }
};

module.exports = docSeeder;
