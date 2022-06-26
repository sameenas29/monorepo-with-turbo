import { useMemo } from "react";
import { jsx } from "react/jsx-runtime";
function ExternalVideo(props) {
  const {
    data,
    options,
    id = data.id,
    frameBorder = "0",
    allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
    allowFullScreen = true,
    ...passthroughProps
  } = props;
  if (!data.embedUrl) {
    throw new Error(`<ExternalVideo/> requires the 'embedUrl' property`);
  }
  const url = useEmbeddedVideoUrl(data.embedUrl, options);
  return /* @__PURE__ */ jsx("iframe", {
    ...passthroughProps,
    id: id ?? data.embedUrl,
    frameBorder,
    allow,
    allowFullScreen,
    src: url,
    "data-testid": "video-iframe"
  });
}
function useEmbeddedVideoUrl(url, parameters) {
  return useMemo(() => {
    if (!parameters) {
      return url;
    }
    return addParametersToEmbeddedVideoUrl(url, parameters);
  }, [url, parameters]);
}
function addParametersToEmbeddedVideoUrl(url, parameters) {
  if (parameters == null) {
    return url;
  }
  const params = Object.keys(parameters).reduce((accumulator, param) => {
    const value = parameters[param];
    if (value == null) {
      return accumulator;
    }
    return accumulator + `&${param}=${value}`;
  }, "");
  return `${url}?${params}`;
}
export { ExternalVideo, addParametersToEmbeddedVideoUrl, useEmbeddedVideoUrl };
//# sourceMappingURL=ExternalVideo.js.map
