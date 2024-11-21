import { Unity, useUnityContext } from "react-unity-webgl";
import Box from '@mui/material/Box';
import { useEffect, useState, useCallback } from "react";
import * as AWS from 'aws-sdk';
import { Widget } from '@xsolla/login-sdk';
import emailjs from 'emailjs-com';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './progress.css';
import { getLogins, users } from './GetLogins.js'
import ssmParams from "./GetParameters.js";

/* const xl = new Widget({
  projectId: process.env.REACT_APP_AWS_XSOLLA_PROJECT_ID,
  preferredLocale: 'en_US',
  callbackUrl: 'https://login.xsolla.com/api/blank'
}); */
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const Play = () => {
  const [userName, setUserName] = useState();
  const [passWord, setPassWord] = useState();
  const [gameVisible, setGameVisible] = useState(false);
  const [recentLogins, setRecentLogins] = useState();
  const [loadingProgressionLag, setLoadingProgressionLag] = useState(0);
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

    setUserName(username);
    setPassWord(password);

    var authenticationData = {
      Username: username,
      Password: password,
    };

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );




    var userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: ssmParams.UserPoolId,
      ClientId: ssmParams.ClientId
    });
    var userData = {
      Username: username,
      Pool: userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);


    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        var accessToken = result.getAccessToken().getJwtToken();
        var idToken = result.getIdToken().getJwtToken();
        var refreshToken = result.getRefreshToken().getToken();
        //POTENTIAL: Region needs to be set if not already set previously elsewhere.

        //FOR SOME REASON THIS SECTION DIDN'T GET TRANSFERED TO REFACTOR LETS SEE IF I ACTUALLY NEED IT
        /* AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID, // your identity pool id here

          Logins: {
            [`cognito-idp.${process.env.AWS_REGION}
              .amazonaws.com/${process.env.REACT_APP_AWS_USER_POOL_ID}`]:
              result.getIdToken().getJwtToken()
          }
        });

        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh(error => {
          if (error) {

            console.error(error);
          } else {
            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();

          }
        }); */
        sendMessage("AuthenticationManager", "LoginSuccess",
          idToken + "@@!@@" + accessToken + "@@!@@" + refreshToken
        );

      },

      onFailure: function (err) {
        sendMessage("MessageContainer", "SetMessageText", err.message || JSON.stringify(err));

      },
    });


  }, [sendMessage]);

  const sendFeedback = useCallback((username, messagea) => {

    var templateParams = {
      message: 'From: ' + username + "\n" + messagea
    }
    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.REACT_APP_EMAILJS_USER_ID)
      .then(function (response) {

      }, function (err) {

      });


  }, []);

  const handleBuyStarbuck = useCallback((token) => {

    const purchaseUrl = "https://sandbox-secure.xsolla.com/paystation4/?token=" + token


    window.location.href = purchaseUrl;


  }, [sendMessage]);

  const showLoginError = (err) => {

  }
  useEffect(() => {
    addEventListener("TryLogin", handleLogin);
    return () => {
      removeEventListener("TryLogin", handleLogin);
    };
  }, [addEventListener, removeEventListener, handleLogin]);

  useEffect(() => {
    addEventListener("SendFeedback", sendFeedback);
    return () => {
      removeEventListener("SendFeedback", sendFeedback);
    };
  }, [addEventListener, removeEventListener, sendFeedback]);

  useEffect(() => {
    addEventListener("BuyStarbuck", handleBuyStarbuck);
    return () => {
      removeEventListener("BuyStarbuck", handleBuyStarbuck);
    };
  }, [addEventListener, removeEventListener, handleBuyStarbuck]);


  useEffect(() => {
    setTimeout(function () {
      setLoadingProgressionLag(loadingProgression);
    }, 675);

  }, [loadingProgression])
  useEffect(() => {
    if (isLoaded) {
      setTimeout(function () {
        setGameVisible(true);
      }, 2000)
    }

  }, [isLoaded])
  useEffect(() => {

    const interval = setInterval(() => {
      getLogins();
      setRecentLogins(users);
    }, 10000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    setGameVisible(false);
  }, [])

  useEffect(() => {
    //call some function in the game to set the recently logged in users count

    if (recentLogins != null) {
      sendMessage("CloudWatch", "UpdateLogins", String(recentLogins));
    }

  }, [recentLogins]);
  // xl.mount('xl_auth');

  /* const showFullscreen = () => {
    alert("hi")
    const myDiv = document.querySelector('#xl_auth');
    myDiv.style.display = 'block';

    xl.open();
  } */

  return (
    <Box
      sx={{
        // border: 5,
        // borderColor: 'error.main'.
        height: '100vh',
        width: 1

      }}>


      {!gameVisible && (
        <div className="bg">
          <div className="  w-75 progressbar">
            <div className="progress_bar_border"></div>

            <ProgressBar variant="success" animated now={loadingProgression * 100} />
            <div className=" progress-bar-text">{Math.round(loadingProgressionLag * 100) + '%'}</div>
          </div>
        </div>
      )}

      <Unity
        unityProvider={unityProvider}
        style={{
          height: '100%',
          width: '100%',
          visibility: gameVisible ? "visible" : "hidden",
          display: gameVisible ? "block" : "none"
        }} />
      {/* <div id="xl_auth" style={{display: 'none'}}></div> 
<button onClick={()=>showFullscreen()}>Fullscreen widget</button> */}

    </Box>
  )

};

export default Play;