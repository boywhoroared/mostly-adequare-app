var path = require('path');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js"
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
    port: 3000,
    proxy: {
      "/flickr": {
        changeOrigin: true,
        target: "https://api.flickr.com",
        pathRewrite: { "^/flickr": "" }
      }
    }
  }
};
