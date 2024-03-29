import { join } from 'path';
import { Configuration, Inject } from '@tsed/di';
import { PlatformApplication } from '@tsed/common';
import '@tsed/platform-express'; // /!\ keep this import
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import '@tsed/ajv';
import express from 'express';
import { config } from './config';
import * as Controllers from './controllers';

@Configuration({
  ...config,
  acceptMimes: ['application/json'],
  httpPort: process.env.PORT || 8000,
  httpsPort: false, // CHANGE
  componentsScan: false,
  mount: {
    '/': [...Object.values(Controllers)],
  },
  middlewares: [
    cors(),
    cookieParser(),
    compress({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true,
    }),
    express.static('*', {
      setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/json');
      },
    }),
  ],
  views: {
    root: join(process.cwd(), '../views'),
    extensions: {
      ejs: 'ejs',
    },
  },
  exclude: ['**/*.spec.ts'],
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;

  $beforeRoutesInit() {
    this.app.raw.set('json spaces', 2);
  }
}
