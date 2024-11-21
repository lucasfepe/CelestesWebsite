
import { getParameter } from '../utils/ParameterStore';
import * as AWS from 'aws-sdk';
import ssmParams from '../pages/GetParameters';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

export class AuthService {
    async configureUserPool() {
        return new AmazonCognitoIdentity.CognitoUserPool({
            UserPoolId: ssmParams.UserPoolId,
            ClientId: ssmParams.ClientId
        });
    }

    async authenticateUser(username, password) {
        const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });

        const userPool = await this.configureUserPool();
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: userPool,
        });

        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authDetails, {
                onSuccess: (result) => resolve(this.getTokens(result)),
                onFailure: (err) => reject(err)
            });
        });
    }

    getTokens(result) {
        return {
            accessToken: result.getAccessToken().getJwtToken(),
            idToken: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken()
        };
    }
}