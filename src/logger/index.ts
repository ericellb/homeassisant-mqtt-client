import pino, { LoggerOptions } from 'pino';

export const createLogger = (opts?: LoggerOptions) => {
  return pino({
    ...opts,
    prettyPrint: {
      translateTime: true
    }
  });
};
