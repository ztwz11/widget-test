const { defineConfig } = require("@vue/cli-service");
const CopyPlugin = require("copy-webpack-plugin");
//const path = require("path"); // path 모듈 추가

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: true,
  runtimeCompiler: true,
  configureWebpack: {
    output: {
      filename: "js/[name].js",
      chunkFilename: "js/[name].js",
    },
    optimization: {
      minimize: false,
      // splitChunks: {
      //   minSize: 10,
      //   maxSize: 70000,
      //   cacheGroups: {
      //     common: {
      //       test: /[\\/]src[\\/]widget[\\/]common[\\/]/,
      //       name: "common",
      //       chunks: "all",
      //     },
      //     control: {
      //       test: /[\\/]src[\\/]widget[\\/]control[\\/]/,
      //       name: "control",
      //       chunks: "all",
      //     },
      //     pageBase: {
      //       test: /[\\/]src[\\/]widget[\\/]page[\\/]base[\\/]/,
      //       name: "pageBase",
      //       chunks: "all",
      //     },
      //   },
      // },
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "public",
            to: "",
            globOptions: { ignore: ["**/index.html"] },
          },
        ],
      }),
    ],
  },
  // chainWebpack: (config) => {
  //   config.plugins.delete("named-chunks");
  //   config.plugins.delete("hash-module-ids");
  //   config.resolve.alias.set(
  //     "@control",
  //     path.resolve(__dirname, "src/widget/control")
  //   );
  // },
  outputDir: "dist",
  assetsDir: "js",
});
