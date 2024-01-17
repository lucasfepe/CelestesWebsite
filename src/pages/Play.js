import { Unity, useUnityContext } from "react-unity-webgl";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Fragment from 'react'
import { useEffect, useState, useCallback } from "react";
import * as AWS from 'aws-sdk';
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');


const Play = () => {
  const [userName, setUserName] = useState();
  const [passWord, setPassWord] = useState();
  const { 
    unityContext,
    unityProvider, 
    loadingProgression, 
    isLoaded, 
    sendMessage, 
    addEventListener, 
    removeEventListener 
  } = useUnityContext({
    loaderUrl: "build_game/_BuildWeb.loader.js",
    dataUrl: "build_game/_BuildWeb.data",
    frameworkUrl: "build_game/_BuildWeb.framework.js",
    codeUrl: "build_game/_BuildWeb.wasm",
  });

const handleLogin = useCallback((username, password) => {
    console.log("username: " + username);
    setUserName(username);
    setPassWord(password);

    var authenticationData = {
      Username: username,
      Password: password,
    };
  
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    console.log("aUTH DEETS: " + authenticationDetails);
    var poolData = {
      UserPoolId: 'us-east-1_CThpLlXz4', // Your user pool id here
      ClientId: '3gqrf39ovipl4s36okr35lad9s', // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
      Username: username,
      Pool: userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);


    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        var accessToken = result.getAccessToken().getJwtToken();
        var idToken = result.getIdToken().getJwtToken();
        var refreshToken = result.getRefreshToken().getToken();
        //POTENTIAL: Region needs to be set if not already set previously elsewhere.
        AWS.config.region = 'us-east-1';
    
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-east-1:5d4d5791-ea51-4c24-a42b-d3a61568a558', // your identity pool id here
          Logins: {
            // Change the key below according to the specific region your user pool is in.
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_CThpLlXz4': result
              .getIdToken()
              .getJwtToken(),
          },
        });
    
        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh(error => {
          if (error) {
            console.log("error loging in");
            console.error(error);
          } else {
            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();
            console.log('Successfully logged!');
          }
        });
        sendMessage("AuthenticationManager","LoginSuccess",
              idToken + "@@!@@" + accessToken + "@@!@@" + refreshToken
        );
        
      },
    
      onFailure: function(err) {
        sendMessage("MessageContainer","SetMessageText",err.message || JSON.stringify(err));
        
      },
    });


  }, [sendMessage]);
  const showLoginError = (err) => {
   
  }
  useEffect(() => {
    addEventListener("TryLogin", handleLogin);
    return () => {
      removeEventListener("TryLogin", handleLogin);
    };
  }, [addEventListener, removeEventListener, handleLogin]);  
  
  return (
    <Box
      sx={{
        // border: 5,
        // borderColor: 'error.main',
        height: '100vh',
        width: 1
        
      }}>
        
         {!isLoaded && (
          <CircularProgress sx={{
            position:'absolute',
            top:'50%',
            left:'50%',
            msTransform:'translateY(-50%)',
            transform:'translateY(-50%)'
          }}/>
          
        )}

         <Unity
          unityProvider={unityProvider}
          style={{
            height: '100%',
            width: '100%',
            visibility: isLoaded ? "visible" : "hidden"
          }} />  
    

    </Box>
  )

};

export default Play;