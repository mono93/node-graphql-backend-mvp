import { Router } from 'express';
import healthRouter from './health';
import userRouter from './user';
import { initializeGraphQLRoute } from './graphql';

const createRoutes = async () => {
  const apiRouter = Router();

  // Initialize GraphQL and get the router
  const graphqlRouter = await initializeGraphQLRoute();

  // Mount routes
  apiRouter.use('/health', healthRouter);
  apiRouter.use('/graphql', graphqlRouter);
  apiRouter.use('/users', userRouter);

  return apiRouter;
};

export { createRoutes };
