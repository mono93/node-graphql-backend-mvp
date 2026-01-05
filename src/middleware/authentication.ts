import { auth } from 'express-oauth2-jwt-bearer';
import { Request, Response, NextFunction } from 'express';
import { envConfig } from '../config';

/**
 * Authentication
 */

export const authenticateUser = auth({
  audience: envConfig.audience,
  issuerBaseURL: envConfig.issuerBaseUrl,
});
