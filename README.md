# Document Management System (API)

[![Build Status](https://travis-ci.org/andela-oolutola/document-management-system-api.svg?branch=develop)](https://travis-ci.org/andela-oolutola/document-management-system-api)
[![Coverage Status](https://coveralls.io/repos/github/andela-oolutola/document-management-system-api/badge.svg)](https://coveralls.io/github/andela-oolutola/document-management-system-api)
[![Code Climate](https://codeclimate.com/github/andela-oolutola/document-management-system-api/badges/gpa.svg)](https://codeclimate.com/github/andela-oolutola/document-management-system-api)

## About this Repo
The API is built to handle document management. The application is capable of keeping a record of the documents created and modified by different users with different roles that defines their access to other documents. The application API also allows the end user to get the exact number of documents they require and set special queries for more precise matching.

This code base written in javaScript and runs on Node JS enviroment. It also uses Express JS to implement the routing for the application. The API handles CRUD (create, retreive, update and delete) operations for `user`, `documents` & `roles`. The application utilises`JSON Web Token` to  provide a secure way to access and pass data & information between the server and the client. This API makes use of `PostgreSQL` as the database and `Sequelize` as the `Object Relational Mapper (ORM)`.

## How to Use
To make use of this API, first create a clone by running the following command
```bash
git clone https://github.com/andela-oolutola/document-management-system-api.git
```
Create a `.env` file to store the  follwing environment variables.
```
SECRET = secret for JWT signing and verification
TEST_DB_PASSWORD= test database password
TEST_DB_USER= test database username
```

You'll also need to setup your configuration file for `postgres sequelize` connection. The file is located in config folder at the root of the project.

Once you are done with configuration, run `npm install` to install dependencies for the application and run `npm run seed` to seed the database with default data.

You can run the tests for the application with this command `npm test`.

The application can be started with the following command
```bash
node index.js
```

The server would startup on the port 8080 and can be tested with a tool such as `Postman`. Data sent to the server would need to be in `JSON` format. The table below shows a list of the endpoints publicly available in the application.


EndPoint | Functionality
--- | ---
POST /users/login | Logs a user in.
POST /users/ | Creates a new user.
GET /users/ | Find matching instances of user.s
GET /users/userId | Find user.
PUT /users/userId | Update user attributes.
DELETE /users/userId | Delete user.
POST /documents/ | Creates a new document instance.
GET /documents/ | Find matching instances of document.
GET /documents/?limit=x | Find x matching instances of document.
GET /documents/?date=yyyy-MM-dd | Find instances of document created on the given date.
GET /documents/?offset=y | Find instances of document starting at the yth index.
GET /documents/documentId | Find document.
PUT /documents/documentId | Update document attributes.
DELETE /documents/documentId | Delete document.
GET /users/userId/documents | Find all documents belonging to the user .
POST /roles/ | Creates a new role instance.
GET /roles/ | Find matching instances of role.
GET /roles/roleId | Find role.
PUT /roles/roleId | Update role attributes.
DELETE /roles/roleId | Delete role.
