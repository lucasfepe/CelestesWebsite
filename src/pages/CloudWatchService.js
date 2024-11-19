import * as AWS from 'aws-sdk';

AWS.config.region = process.env.REACT_APP_AWS_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID });
const cw = new AWS.CloudWatch({ apiVersion: "2010-08-01" });

export default cw;