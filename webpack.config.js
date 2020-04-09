const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
module.exports = function (env) {
  let config = {
    entry: {
      index: "./src/index.js",
    },
    output: {
      path: resolve("./dist"),
      filename: "js/[name].[hash].bundle.js",
      publicPath: "/",
    },
    mode: env.NODE_ENV,
    watch: env.NODE_ENV == "development",
    target: "web",
    devtool: env.NODE_ENV == "development" ? "inline-source-map" : undefined,
    resolve: {
      extensions: [".js", ".vue", ".json", ".scss"],
      alias: {
        "@": resolve("src"),
      },
      modules: ["./", "node_modules"],
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js$/,
          exclude: /node_modules/,
          include: [path.resolve("src")],
          use: [
            {
              loader: "eslint-loader",
              options: {
                // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
                formatter: require("eslint-friendly-formatter"), // 指定错误报告的格式规范
              },
            },
          ],
        },
        {
          test: /.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
              },
            },
          ],
        },
        {
          test: /.(scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                config: {
                  path: resolve("./postcss.config.js"),
                },
              },
            },
            "sass-loader",
            {
              loader: "sass-resources-loader",
              options: {
                resources: ["src/theme/variable.scss"],
              },
            },
          ],
        },
        {
          test: /.(css)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                config: {
                  path: resolve("./postcss.config.js"),
                },
              },
            },
          ],
        },
        {
          test: /.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "assets/images/[name].[ext]",
              },
            },
          ],
        },
        {
          test: /.(woff|woff2|eot|ttf|otf)$/,
          use: ["file-loader"],
        },
        {
          test: /\.vue$/,
          use: ["vue-loader"],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: "styles/style.css",
        chunkFilename: "styles/style.css",
        ignoreOrder: false,
      }),
      new HtmlWebpackPlugin({
        title: "live broadcasting",
        filename: "index.html",
        template: resolve("src/index.html"),
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
    optimization: {
      minimize: true,
      noEmitOnErrors: true,
      namedModules: true,
      splitChunks: {
        chunks: "async",
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 6,
        maxInitialRequests: 4,
        automaticNameDelimiter: "~",
        automaticNameMaxLength: 30,
        cacheGroups: {
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            priority: 10, // 优先级
          },
          common: {
            name: "common",
            test: /[\\/]src[\\/]/,
            minSize: 1024,
            chunks: "all",
            priority: 5,
          },
        },
      },
    },
    devServer: {
      stats: "minimal",
      clientLogLevel: "none",
      contentBase: path.resolve("dist"),
      compress: true,
      port: 8080,
      hot: true,
    },
  };
  return config;
};
