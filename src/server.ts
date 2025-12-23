import { createApp } from './app';
import { validateEnvVars } from './common/utilities';
import mongoose from 'mongoose';
import logger from './common/logging';

const startServer = async (): Promise<void> => {
  const mandetoryEnvVars = ['PORT', 'MONGO_URI'];

  validateEnvVars(mandetoryEnvVars);

  const PORT = process.env.PORT!;

  try {
    await mongoose.connect(process.env.MONGO_URI!);
    logger.log('Connected to MongoDb');
  } catch (error) {
    logger.error('❌ Error connecting to MongoDb:', error);
  }

  const app = await createApp();

  app.listen(PORT, () => {
    logger.log(`🚀 Server ready at http://localhost:${PORT}`);
    logger.log(`🚀 GraphQL endpoint at http://localhost:${PORT}/graphql`);
  });
};

startServer();
