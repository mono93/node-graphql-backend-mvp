import { Router } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@as-integrations/express5';

import { typeDefs } from '../graphql/schema';
import { resolvers } from '../graphql/resolvers';
import authenticateUser from '../middleware.ts/authentication';

const initializeGraphQLRoute = async () => {
  const appolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await appolloServer.start();

  const graphqlRouter = Router();
  graphqlRouter.use('/', authenticateUser, apolloMiddleware(appolloServer));

  return graphqlRouter;
};

export { initializeGraphQLRoute };
