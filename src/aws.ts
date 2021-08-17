import AWS = require('aws-sdk');
import {config} from './config/config';
import bunyan from 'bunyan';

let logger = bunyan.createLogger({name: 'api-feed'});

// Configure AWS
const credentials = new AWS.SharedIniFileCredentials({profile: config.aws_profile});
AWS.config.credentials = credentials;
logger.info("++++ credentials are : ++++" );
logger.info(JSON.stringify(credentials));

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: config.aws_region,
  params: {Bucket: config.aws_media_bucket}
});

// Generates an AWS signed URL for retrieving objects
export function getGetSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;
  logger.info("s3 is : "+  JSON.stringify(s3));
  
  const url : string = s3.getSignedUrl('getObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
  logger.info("++++ getGetSignedUrl is : +++++");
  logger.info(url);
  return url;
}

// Generates an AWS signed URL for uploading objects
export function getPutSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;

  const url =  s3.getSignedUrl('putObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });

  logger.info("++++ getPutSignedUrl is : ++++");
  logger.info(url);
  return url;
}
