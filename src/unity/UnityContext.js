import { useUnityContext } from "react-unity-webgl";

export const useGameContext = () => {
    const unityConfig = {
        loaderUrl: "build_game/_BuildWeb.loader.js",
        dataUrl: "build_game/_BuildWeb.data",
        frameworkUrl: "build_game/_BuildWeb.framework.js",
        codeUrl: "build_game/_BuildWeb.wasm",
    };

    return useUnityContext(unityConfig);
};
