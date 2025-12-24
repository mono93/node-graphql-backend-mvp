import { createApp } from './app';
import { validateEnvVars } from './common/utilities';
import { API_BASE_PATH } from './common/constants';
import mongoose from 'mongoose';
import logger from './common/logging';
import { envConfig } from './config';

const startServer = async (): Promise<void> => {
  const mandetoryEnvVars = ['PORT', 'MONGO_URI', 'ISSUER_BASE_URL', 'AUDIENCE'];

  validateEnvVars(mandetoryEnvVars);

  const PORT = envConfig.port;

  try {
    await mongoose.connect(envConfig.mongoUri);
    logger.log('Connected to MongoDb');
  } catch (error) {
    logger.error('❌ Error connecting to MongoDb:', error);
  }

  const app = await createApp();

  app.listen(PORT, () => {
    logger.log(`🚀 Server ready at http://localhost:${PORT}`);
    logger.log(`GraphQL endpoint at http://localhost:${PORT}${API_BASE_PATH}/graphql`);
  });
};

startServer();
