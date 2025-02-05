/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import LokiTransport = require('winston-loki');
import _default from './../../node_modules/fecha/lib/fecha.d';

@Injectable()
export class Applogger implements LoggerService {
  private logger: winston.Logger;
  private enabled = true;
  private context?: string;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          (info) =>
            `${info.timestamp} ${info.level.toUpperCase()}: [${info.context}] ${info.message}`,
        ),
      ),
      transports: [
        new LokiTransport({
          host: process.env.LOKI_HOST || '',
          labels: { conteinerapps: process.env.LOKI_LABELS || 'default' },
          basicAuth: Buffer.from(
            `${process.env.LOKI_USERNAME || ''}:${process.env.LOKI_PASSWORD || ''}`,
          ).toString('base64'),
        }),
      ],
    });
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    if (this.enabled) {
      this.logger.info(message, { context: context || this.context });
    }
  }

  error(message: any, trace?: string, context?: string) {
    if (this.enabled) {
      this.logger.error(message, { trace, context: context || this.context });
    }
  }

  warn(message: any, context?: string) {
    if (this.enabled) {
      this.logger.warn(message, { context: context || this.context });
    }
  }

  debug(message: any, context?: string) {
    if (this.enabled) {
      this.logger.debug(message, { context: context || this.context });
    }
  }

  verbose(message: any, context?: string) {
    if (this.enabled) {
      this.logger.verbose(message, { context: context || this.context });
    }
  }
}
