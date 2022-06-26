import { useImageUrl } from "../Image/image_size.js";
import { jsx } from "react/jsx-runtime";
function Video(props) {
  var _a;
  const {
    data,
    options,
    id = data.id,
    playsInline = true,
    controls = true,
    ...passthroughProps
  } = props;
  const posterUrl = useImageUrl((_a = data.previewImage) == null ? void 0 : _a.url, options);
  if (!data.sources) {
    throw new Error(`<Video/> requires a 'data.sources' array`);
  }
  return /* @__PURE__ */ jsx("video", {
    ...passthroughProps,
    id,
    playsInline,
    controls,
    poster: posterUrl,
    "data-testid": "video",
    children: data.sources.map((source) => {
      if (!((source == null ? void 0 : source.url) && (source == null ? void 0 : source.mimeType))) {
        throw new Error(`<Video/> needs 'source.url' and 'source.mimeType'`);
      }
      return /* @__PURE__ */ jsx("source", {
        src: source.url,
        type: source.mimeType,
        "data-testid": "video-screen"
      }, source.url);
    })
  });
}
export { Video };
//# sourceMappingURL=Video.js.map
