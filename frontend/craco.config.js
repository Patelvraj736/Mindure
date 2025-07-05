const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
     
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
          ...(webpackConfig.resolve.fallback || {}),
          fs: false,
        },
      };

      webpackConfig.module.rules.push({
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: [/node_modules\/face-api.js/],
      });

      webpackConfig.ignoreWarnings = [
        {
          module: /node_modules\/face-api.js/,
          message: /Failed to parse source map/,
        },
      ];

      return webpackConfig;
    },
  },
};
