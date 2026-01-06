import { auth } from 'express-oauth2-jwt-bearer';
import { envConfig } from '../config';

/**
 * Authentication
 */

export const authenticateUser = auth({
  audience: envConfig.audience,
  issuerBaseURL: envConfig.issuerBaseUrl,
});
