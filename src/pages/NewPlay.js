import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useCallback, useEffect } from "react";
import Box from '@mui/material/Box';
import { AuthService } from 'auth/AuthService'
import { useGameContext } from 'unity/UnityContext';
import { LoadingProgress } from 'components/LoadingProgress';
import { GameView } from 'components/GameView';
import { getLogins, users } from './GetLogins';
import emailjs from 'emailjs-com';


const Play = () => {

    const [recentLogins, setRecentLogins] = useState();
    const [gameVisible, setGameVisible] = useState(false);
    const [loadingProgressionLag, setLoadingProgressionLag] = useState(0);
    const {
        unityProvider,
        loadingProgression,
        isLoaded,
        sendMessage,
        addEventListener,
        removeEventListener
    } = useGameContext();

    const authService = new AuthService();

    const handleLogin = useCallback(async (username, password) => {
        try {
            const tokens = await authService.authenticateUser(username, password);
            sendMessage(
                "AuthenticationManager",
                "LoginSuccess",
                `${tokens.idToken}@@!@@${tokens.accessToken}@@!@@${tokens.refreshToken}`
            );
        } catch (error) {
            sendMessage("MessageContainer", "SetMessageText", error.message);
        }
    }, [sendMessage]);

    useEffect(() => {
        addEventListener("TryLogin", handleLogin);
        return () => {
            removeEventListener("TryLogin", handleLogin);
        };
    }, [addEventListener, removeEventListener, handleLogin]);
    const handleBuyStarbuck = useCallback((token) => {

        const purchaseUrl = "https://sandbox-secure.xsolla.com/paystation4/?token=" + token


        window.location.href = purchaseUrl;


    }, [sendMessage]);
    useEffect(() => {
        addEventListener("BuyStarbuck", handleBuyStarbuck);
        return () => {
            removeEventListener("BuyStarbuck", handleBuyStarbuck);
        };
    }, [addEventListener, removeEventListener, handleBuyStarbuck]);
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
    useEffect(() => {
        addEventListener("SendFeedback", sendFeedback);
        return () => {
            removeEventListener("SendFeedback", sendFeedback);
        };
    }, [addEventListener, removeEventListener, sendFeedback]);

    // Loading progress effect
    useEffect(() => {
        setTimeout(function () {
            setLoadingProgressionLag(loadingProgression);
        }, 675);

    }, [loadingProgression])

    // Game visibility effect
    useEffect(() => {
        if (isLoaded) {
            const timer = setTimeout(() => {
                setGameVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoaded]);

    // Login polling effect
    useEffect(() => {
        const interval = setInterval(async () => {
            getLogins();
            setRecentLogins(users == 0 ? 'Loading...' : users);
        }, 10000);
        return () => clearInterval(interval);
    }, []);





    return (
        <Box sx={{ height: '100vh', width: 1 }}>
            {!gameVisible && (
                <LoadingProgress
                    progress={loadingProgression}
                    displayProgress={loadingProgressionLag}
                />
            )}
            <GameView
                unityProvider={unityProvider}
                isVisible={gameVisible}
            />
        </Box>
    );
};

export default Play;
