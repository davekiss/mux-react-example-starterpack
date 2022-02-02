/**
 * We need to have a server-side solution
 * to make API requests in place because it is not secure to use your
 * Mux credentials directly in the browser environment.
 *
 * This proxy acts as a fake server to handle client-side API requests
 * and forward them on to Mux.
 *
 * Make sure to add your Mux API access credentials to a `.env` file
 * located at the root directory of this project.
 */
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require("jsonwebtoken");
const base64 = require("base64url");

const publicKey = process.env.REACT_APP_MUX_ACCESS_TOKEN_ID;
const secretKey = process.env.REACT_APP_MUX_SECRET_KEY;
const auth = btoa(`${publicKey}:${secretKey}`);

module.exports = function (app) {
  app.use(
    '/my-api/**',
    createProxyMiddleware({
      target: 'https://api.mux.com',
      pathRewrite: (path, req) => path.replace('/my-api', ''),
      changeOrigin: true,
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      }
    })
  );

  app.use(
    '/stats/**',
    createProxyMiddleware({
      target: 'https://stats.mux.com/counts',
      pathRewrite: (path, req) => {
        // generate jwt
        const privateKey = base64.decode(
          process.env.REACT_APP_MUX_DATA_SIGNING_KEY_SECRET
        );

        const keyId = process.env.REACT_APP_MUX_DATA_SIGNING_KEY_ID;
        const livestreamId = req.query.livestreamId;

        const token = jwt.sign(
          {
            sub: livestreamId,
            aud: "live_stream_id",
            exp: Date.now() + 600, // UNIX Epoch seconds when the token expires
            kid: keyId,
          },
          privateKey,
          { algorithm: "RS256" }
        );

        return path.replace('/stats', `?token=${token}`)
      },
      changeOrigin: true
    })
  );
};