const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api", {
            target: "http://emart.cafe24app.com/",
            changeOrigin: true,
        })

    );
};