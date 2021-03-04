import pino, { LoggerOptions } from 'pino';

export interface CustomLogger {
  fatal(msg: string): void;
  error(msg: string): void;
  warn(msg: string): void;
  info(msg: string): void;
  debug(msg: string): void;
  trace(msg: string): void;
}

export interface CustomLoggerOptions extends LoggerOptions {
  outputFile: string;
}

export const createLogger = (opts: CustomLoggerOptions) => {
  const stdoutStreamOptions = {
    ...opts,
    prettyPrint: {
      translateTime: true
    }
  };

  const fileStreamOptions = {
    ...opts
  };

  const stdoutLogger = pino(stdoutStreamOptions, pino.destination(1));
  const fileLogger = pino(fileStreamOptions, pino.destination('./log.txt'));

  const fatal = (msg: string) => {
    stdoutLogger.fatal(msg);
    fileLogger.fatal(msg);
  };
  const error = (msg: string) => {
    stdoutLogger.error(msg);
    fileLogger.error(msg);
  };
  const warn = (msg: string) => {
    stdoutLogger.warn(msg);
    fileLogger.warn(msg);
  };
  const info = (msg: string) => {
    stdoutLogger.info(msg);
    fileLogger.info(msg);
  };
  const debug = (msg: string) => {
    stdoutLogger.debug(msg);
    fileLogger.debug(msg);
  };
  const trace = (msg: string) => {
    stdoutLogger.trace(msg);
    fileLogger.trace(msg);
  };

  return {
    fatal,
    error,
    warn,
    info,
    debug,
    trace
  };
};
