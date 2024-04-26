import { Unity, useUnityContext } from "react-unity-webgl";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Fragment from 'react'
import { useEffect, useState, useCallback } from "react";
import * as AWS from 'aws-sdk';
import { Widget } from '@xsolla/login-sdk';
import emailjs from 'emailjs-com';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './progress.css';

const xl = new Widget({
  projectId: '1747c7a4-2f4e-4c89-923e-dc17328f395e',
  preferredLocale: 'en_US',
  callbackUrl: 'https://login.xsolla.com/api/blank'
});
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');



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
      onSuccess: function (result) {
        var accessToken = result.getAccessToken().getJwtToken();
        var idToken = result.getIdToken().getJwtToken();
        var refreshToken = result.getRefreshToken().getToken();
        //POTENTIAL: Region needs to be set if not already set previously elsewhere.


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
    emailjs.send('service_bt0g4gs', 'template_yx2bshc', templateParams, 'FA7CaRkml7_QcDlG3')
      .then(function (response) {
        console.log('SUCCESS!', response.status, response.text);
      }, function (err) {
        console.log('FAILED...', err);
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
  const getLogins = () => {
    AWS.config.region = 'us-east-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: 'us-east-1:5d4d5791-ea51-4c24-a42b-d3a61568a558' });
    const cw = new AWS.CloudWatch({ apiVersion: "2010-08-01" });
    var params = {
      MetricDataQueries: [
        {
          Id: "m1",
          ReturnData: true,
          MetricStat: {
            Period: 1,

            Stat: "Sum",
            Metric: {
              Namespace: "AWS/Cognito",
              MetricName: "SignInSuccesses",
              Dimensions: [
                {
                  Name: "UserPool",
                  Value: "us-east-1_CThpLlXz4"
                },
                {
                  Name: "UserPoolClient",
                  Value: "3gqrf39ovipl4s36okr35lad9s"
                }
              ]
            }
          },

          AccountId: "412205003013"
        }
      ],
      StartTime: new Date(Date.now() - 1000 * 60 * 10),
      EndTime: (new Date()).toISOString()



    };
    var params2 = {
      MetricDataQueries: [
        {
          Id: "m1",
          ReturnData: true,
          MetricStat: {
            Period: 1,

            Stat: "Sum",
            Metric: {
              Namespace: "AWS/Cognito",
              MetricName: "TokenRefreshSuccesses",
              Dimensions: [
                {
                  Name: "UserPool",
                  Value: "us-east-1_CThpLlXz4"
                },
                {
                  Name: "UserPoolClient",
                  Value: "3gqrf39ovipl4s36okr35lad9s"
                }
              ]
            }
          },

          AccountId: "412205003013"
        }
      ],
      StartTime: new Date(Date.now() - 1000 * 60 * 10),
      EndTime: (new Date()).toISOString()



    };
    let users1 = 0;
    let users2 = 0;


    const functionone = (err, dataone) => {

      if (err) {
        console.log("Error", err);
      } else {
        console.log("dataone: " + JSON.stringify(dataone));
        users1 = dataone.MetricDataResults[0].Values.reduce((a, b) => a + b, 0);
        console.log("recent loginsone: " + users1);
        cw.getMetricData(params2, functiontwo);
      }

    }
    const functiontwo = (err, datatwo) => {
      if (err) {
        console.log("Error", err);
      } else {
        users2 = datatwo.MetricDataResults[0].Values.reduce((a, b) => a + b, 0);
        console.log("recent loginstwo: " + users2);
        console.log("users1: " + users1);
        console.log("users2: " + users2);
        console.log("new value: " + (users1 + users2))
        setRecentLogins(users1 + users2);
      }
    }
    cw.getMetricData(params, functionone);





  }

  useEffect(() => {
    setTimeout(function(){
      setLoadingProgressionLag(loadingProgression);
  }, 675);
    
  },[loadingProgression])
  useEffect(() => {
    if(isLoaded){
      setTimeout(function(){
        setGameVisible(true);
        }, 1000) 
    } 
      
  },[isLoaded])
  useEffect(() => {
    const interval = setInterval(() => {
      getLogins();
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    //call some function in the game to set the recently logged in users count
    console.log("RECENTLOGINS: " + recentLogins);
    if (recentLogins != null) {
      sendMessage("CloudWatch", "UpdateLogins", String(recentLogins));
    }

  }, [recentLogins]);
  xl.mount('xl_auth');

  const showFullscreen = () => {
    alert("hi")
    const myDiv = document.querySelector('#xl_auth');
    myDiv.style.display = 'block';

    xl.open();
  }

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
            
            <ProgressBar  variant="success" animated now={loadingProgression * 100} />
            <div className=" progress-bar-text">{Math.round(loadingProgressionLag * 100) + '%'}</div>
          </div>
        


        </div>





      )}


    <Unity
          unityProvider={unityProvider}
          style={{
            height: '100%',
            width: '100%',
            visibility: gameVisible ? "visible" : "hidden"
          }} />      
      {/* <div id="xl_auth" style={{display: 'none'}}></div> 
<button onClick={()=>showFullscreen()}>Fullscreen widget</button> */}

    </Box>
  )

};

export default Play;