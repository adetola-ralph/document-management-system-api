const dotenv = require('dotenv').config({ silent: true });

module.exports = {
  development: {
    username: 'postgres_user',
    password: 'MsniCUO12*',
    database: 'document_db',
    host: 'localhost',
    port: '5432',
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || null,
    database: 'document_db_test',
    host: 'localhost',
    port: '5432',
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: 'lmkbskydpdegxy',
    password: 'z1Rq8motj0UKwceWa2FgVQOCwX',
    database: 'db3umhfs4kesgb',
    host: 'ec2-54-75-228-85.eu-west-1.compute.amazonaws.com',
    dialect: 'postgres'
  }
};
