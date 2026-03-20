import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/utils/route-errors';
import BaseRouter from '@src/routes/apiRouter';

import EnvVars, { NodeEnvs } from './common/constants/env';

const app = express();

// **** Middleware **** //
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (EnvVars.NodeEnv === NodeEnvs.DEV) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.PRODUCTION) {
  // eslint-disable-next-line no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

app.use('/api', BaseRouter);

// **** Error Handler **** //
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (EnvVars.NodeEnv !== NodeEnvs.TEST.valueOf()) {
    console.error(err);
  }
  let status: number = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});

// **** FrontEnd Content **** //
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Nav to API root by default
app.get('/', (_: Request, res: Response) => {
  return res.json({
    message: 'Collaborative Tamagachi API',
    version: '1.0.0',
    endpoints: {
      hello: '/api/hello',
      helloWithName: '/api/hello/:name'
    }
  });
});

export default app;
