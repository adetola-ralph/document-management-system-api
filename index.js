'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const port       = 8080;

const router     = express.Router();

const routes     = require('./routes');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use morgan to diplay requests from the client
app.use(morgan('dev'));

// Implement the routes
routes(router);

app.use('/api', router);

app.listen(port, function(){
  console.log(`Server started on port ${port}`);
});
module.exports = app;
