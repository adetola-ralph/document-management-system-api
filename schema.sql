DROP DATABASE IF EXISTS document_manager;
CREATE DATABASE document_manager;

\c document_manager

CREATE TABLE Roles (
  title VARCHAR PRIMARY KEY
);

CREATE TABLE Documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT,
  createdAt DATE,
  modifiedAt DATE,
  accessibleBy VARCHAR REFERENCES roles(title)
);

CREATE TABLE Users (
  username VARCHAR PRIMARY KEY,
  firstname VARCHAR NOT NULL,
  lastname VARCHAR NOT NULL,
  email VARCHAR UNIQUE,
  password VARCHAR NOT NULL,
  role VARCHAR REFERENCES roles(title)
);
