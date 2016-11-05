'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const port       = 8080;

// Use morgan to diplay requests from the client
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({response: 'root directory'});
});

app.listen(port, function(){
  console.log(`Server started on port ${port}`);
});
module.exports = app;
