const dotenv     = require('dotenv').config();

module.exports = {
  'development': {
    'username': 'postgres_user',
    'password': 'MsniCUO12*',
    'database': 'document_db',
    'host': 'localhost',
    'port': '5432',
    'dialect': 'postgres'
  },
  'test': {
    'username': 'postgres_user',
    'password': process.env.DB_PASSWORD || null,
    'database': 'document_db_test',
    'host': 'localhost',
    'port': '5432',
    'dialect': 'postgres'
  },
  'production': {
    'username': 'update me',
    'password': 'update me',
    'database': 'update me',
    'host': 'update me',
    'dialect': 'update me'
  }
};
