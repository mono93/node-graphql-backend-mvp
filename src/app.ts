import express, { NextFunction, Request, Response } from 'express';

import { httpLogger } from './common/logging/httpLogger';
import logger from './common/logging';
import { API_BASE_PATH } from './common/constants';
import { createRoutes } from './routes';

const createApp = async () => {
  const app = express();

  app.use(httpLogger);
  app.use(express.json());

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });

  const apiRouter = await createRoutes();
  app.use(API_BASE_PATH, apiRouter);

  app.use((req, res) => {
    res.status(404).send({ message: 'No route found' });
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Uncaught error: ${err.message}`, err);
    res.status(500).send({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'production' ? undefined : err.message,
    });
  });

  return app;
};

export { createApp };
