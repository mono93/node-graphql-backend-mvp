import { Request, Response, NextFunction } from 'express';
import logger from './index';
import { v4 as uuid } from 'uuid';

export function httpLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = uuid();
  res.setHeader('X-Request-Id', requestId);

  const start = Date.now();

  res.on('finish', () => {
    logger.info('HTTP request', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
    });
  });

  next();
}
