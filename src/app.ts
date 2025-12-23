import express, { NextFunction, Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@as-integrations/express5';

import { httpLogger } from './common/logging/httpLogger';
import logger from './common/logging';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

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

  const appolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await appolloServer.start();

  app.use('/graphql', apolloMiddleware(appolloServer));

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
