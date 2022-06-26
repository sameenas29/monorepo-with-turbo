"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydrogenMiddleware = exports.graphiqlMiddleware = void 0;
const graphiql_1 = require("./graphiql");
function graphiqlMiddleware({ getShopifyConfig, dev, }) {
    return async function (request, response, next) {
        if (dev && isGraphiqlRequest(request)) {
            const shopifyConfig = await getShopifyConfig(request);
            return respondWithGraphiql(response, shopifyConfig);
        }
        next();
    };
}
exports.graphiqlMiddleware = graphiqlMiddleware;
let entrypointError = null;
/**
 * Provides middleware to Node.js Express-like servers. Used by the Hydrogen
 * Vite dev server plugin as well as production Node.js implementation.
 */
function hydrogenMiddleware({ dev, cache, indexTemplate, getServerEntrypoint, devServer, }) {
    if (dev && devServer) {
        // Store this globally for devtools
        // @ts-ignore
        globalThis.__viteDevServer = devServer;
    }
    /**
     * We're running in the Node.js runtime without access to `fetch`,
     * which is needed for proxy requests and server-side API requests.
     */
    const webPolyfills = !globalThis.fetch || !globalThis.ReadableStream
        ? Promise.resolve().then(() => __importStar(require('../utilities/web-api-polyfill'))) : undefined;
    return async function (request, response, next) {
        try {
            await webPolyfills;
            const entrypoint = await Promise.resolve(getServerEntrypoint()).catch((error) => {
                // Errors are only thrown the first time we try to load the entry point.
                // After refreshing the browser, this just loads an empty module
                // and doesn't throw anymore. Store this error in the outer scope
                // to keep throwing it on refresh until things are fixed.
                entrypointError = error;
            });
            const handleRequest = entrypoint?.default ?? entrypoint;
            if (typeof handleRequest !== 'function') {
                if (entrypointError) {
                    throw entrypointError;
                }
                else {
                    // This means there is no error when loading the entry point but
                    // we are still not getting a function as the default export.
                    throw new Error('Something is wrong in your project. Make sure to add "export default renderHydrogen(...)" in your server entry file.');
                }
            }
            entrypointError = null;
            await handleRequest(request, {
                dev,
                cache,
                indexTemplate,
                streamableResponse: response,
            });
        }
        catch (e) {
            if (dev && devServer)
                devServer.ssrFixStacktrace(e);
            response.statusCode = 500;
            /**
             * Attempt to print the error stack within the template.
             * This allows the react-refresh plugin and other Vite runtime helpers
             * to display the error and auto-refresh when the error is fixed, instead
             * of a white screen that needs a manual refresh.
             */
            try {
                const template = typeof indexTemplate === 'function'
                    ? await indexTemplate(request.originalUrl ?? request.url ?? '')
                    : indexTemplate;
                const html = template.replace(`<div id="root"></div>`, `<div id="root"><pre><code>${e.stack}</code></pre></div>`);
                response.write(html);
                next(e);
            }
            catch (_e) {
                // If template loading is the culprit, give up and just return the error stack.
                response.write(e.stack);
                next(e);
            }
        }
    };
}
exports.hydrogenMiddleware = hydrogenMiddleware;
/**
 * /graphiql and /___graphql are supported
 */
function isGraphiqlRequest(request) {
    return /^\/(?:_{3})?graphi?ql/.test(request.url || '');
}
async function respondWithGraphiql(response, shopifyConfig) {
    if (!shopifyConfig) {
        throw new Error("You must provide a 'shopify' property in your Hydrogen config file");
    }
    const { storeDomain, storefrontToken, storefrontApiVersion } = shopifyConfig;
    response.setHeader('Content-Type', 'text/html');
    response.end((0, graphiql_1.graphiqlHtml)(storeDomain?.replace(/^https?:\/\//, ''), storefrontToken, storefrontApiVersion));
}
