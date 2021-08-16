import cors from 'cors';
import express from 'express';
import {sequelize} from './sequelize';
import {morgan} from 'morgan';
import {bunyan} from 'bunyan';


import {IndexRouter} from './controllers/v0/index.router';

import bodyParser from 'body-parser';
import {config} from './config/config';
import {V0_FEED_MODELS} from './controllers/v0/model.index';


(async () => {
  let logger = bunyan.createLogger({
    name: 'feed-api',
    streams: [{
      type:'rotating-file',
      path: '/var/log/api-feed.log',
      period: '1d',          // daily rotation
      totalFiles: 10,        // keep up to 10 back copies
      rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
      threshold: '10m',      // Rotate log files larger than 10 megabytes
      totalSize: '20m',      // Don't keep more than 20mb of archived log files
      gzip: true             // Compress the archive log files to save space
    }]
  });
  await sequelize.addModels(V0_FEED_MODELS);
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8080;

  app.use(bodyParser.json());
  app.use(morgan('common'));

  app.use(cors({
    allowedHeaders: [
      'Origin', 'X-Requested-With',
      'Content-Type', 'Accept',
      'X-Access-Token', 'Authorization',
      'Access-Control-Allow-Headers'
    ],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: "*",
  }));

  app.use('/api/v0/', IndexRouter);

  // Root URI call
  app.get( '/', async ( req, res ) => {
    res.send( '/api/v0/' );
  } );


  // Start the Server
  app.listen( port, () => {
    console.log( `server running ${config.url}` );
    console.log( `press CTRL+C to stop server` );
  } );
})();
