import { createLogger, format, transports } from 'winston';

const isProd = process.env.NODE_ENV === 'production';

const logger = createLogger({
  level: isProd ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

// Add console-like methods for convenience
const consoleLogger = {
  ...logger,
  log: (message: string, ...args: any[]) => logger.info(message, args),
  info: (message: string, ...args: any[]) => logger.info(message, args),
  warn: (message: string, ...args: any[]) => logger.warn(message, args),
  debug: (message: string, ...args: any[]) => logger.debug(message, args),
  error: (message: string, ...args: any[]) => logger.error(message, args),
};

export default consoleLogger;
