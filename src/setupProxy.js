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

const publicKey = process.env.REACT_APP_MUX_ACCESS_TOKEN_ID;
const secretKey = process.env.REACT_APP_MUX_SECRET_KEY;
const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');

module.exports = function (app) {
  app.use(
    '/ccv',
    createProxyMiddleware({
      target: 'https://api.mux.com',
      pathRewrite: (path, req) => path.replace('/ccv', '/data/v1/realtime/metrics/current-concurrent-viewers/timeseries'),
      changeOrigin: true,
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      }
    })
  );
};