const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 8080;
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use morgan to diplay requests from the client
app.use(morgan('dev'));

// Implement the routes
routes(router);

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
module.exports = app;
