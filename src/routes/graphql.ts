import { Router } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@as-integrations/express5';

import { typeDefs, resolvers } from '../graphql';
import { authenticateUser } from '../middleware/authentication';
import { createContext } from '../graphql/context';

const initializeGraphQLRoute = async () => {
  const appolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await appolloServer.start();

  const graphqlRouter = Router();
  graphqlRouter.use(
    '/',
    authenticateUser,
    apolloMiddleware(appolloServer, {
      context: async ({ req }) => createContext({ req }),
    }),
  );

  return graphqlRouter;
};

export { initializeGraphQLRoute };
