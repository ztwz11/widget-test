const { defineConfig } = require("@vue/cli-service");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

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
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
        __VUE_PROD_DEVTOOLS__: "true",
      }),
    ],
  },

  // chainWebpack: (config) => {
  //   config.plugin("define").tap((definitions) => {
  //     Object.assign(definitions[0], {
  //       __VUE_OPTIONS_API__: JSON.stringify(true),
  //       __VUE_PROD_DEVTOOLS__: JSON.stringify(
  //         process.env.VUE_APP_PROD_DEVTOOLS === "true"
  //       ),
  //       __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(
  //         process.env.VUE_APP_PROD_HYDRATION_MISMATCH_DETAILS === "true"
  //       ),
  //     });
  //     return definitions;
  //   });
  // },
  outputDir: "dist",
  assetsDir: "js",
});
