import { auth } from 'express-oauth2-jwt-bearer';
import { envConfig } from '../config';

const authenticateUser = auth({
  audience: envConfig.audience,
  issuerBaseURL: envConfig.issuerBaseUrl,
});

// Future enhancement: Add role-based access control (RBAC) checks here
// Future enhancement: add admin user authentication here

export default authenticateUser;
