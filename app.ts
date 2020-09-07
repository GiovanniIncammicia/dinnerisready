import express from 'express';
// import expressOasGenerator  from 'express-oas-generator';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import { connect } from 'mongoose';

import recipesRouter from './server/recipes/routes';
import ingredientsRouter from './server/ingredients/routes';
import calendarRouter from './server/calendar/routes';
import { NOT_FOUND } from './server/utility/httpStatusCodes';
import { errorHandler } from './server/utility/errorHandler';

require('dotenv').config();

const app = express();
// expressOasGenerator.init(app, spec => spec, 'api-spec.json', 60000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'build')));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
if (process.env.NODE_ENV === 'production') app.use(helmet());

app.use('/api/recipes', recipesRouter);
app.use('/api/ingredients', ingredientsRouter);
app.use('/api/calendar', calendarRouter);

app.get('*', (_, res) => { res.sendFile('./build/index.html', { root: __dirname }) });

app.use((_, res) => res.status(NOT_FOUND).send('Not Found'));
app.use(errorHandler);

connect(process.env.MONGODB_URI as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

export default app;
