import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import winston from 'winston';
import routes from './routes';

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
  winston.info(`Server started on port ${port}`);
});

export default app;
