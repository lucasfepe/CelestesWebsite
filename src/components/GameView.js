import { Unity } from "react-unity-webgl";

export const GameView = ({ unityProvider, isVisible }) => (
    <Unity
        unityProvider={unityProvider}
        style={{
            height: '100%',
            width: '100%',
            visibility: isVisible ? "visible" : "hidden",
            display: isVisible ? "block" : "none"
        }}
    />
);
