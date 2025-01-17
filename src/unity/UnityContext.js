import { useUnityContext } from "react-unity-webgl";

export const useGameContext = () => {
    const unityConfig = {
        loaderUrl: "build_game/_Build.loader.js",
        dataUrl: "build_game/_Build.data",
        frameworkUrl: "build_game/_Build.framework.js",
        codeUrl: "build_game/_Build.wasm",
    };

    return useUnityContext(unityConfig);
};
