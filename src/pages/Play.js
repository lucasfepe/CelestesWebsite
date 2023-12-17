import { Unity, useUnityContext } from "react-unity-webgl";

const Play = () => {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build_game/_BuildWeb.loader.js",
    dataUrl: "build_game/_BuildWeb.data",
    frameworkUrl: "build_game/_BuildWeb.framework.js",
    codeUrl: "build_game/_BuildWeb.wasm",
  });

  return <Unity unityProvider={unityProvider} />;
  };
  
  export default Play;