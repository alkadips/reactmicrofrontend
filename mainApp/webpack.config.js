const HtmlWebpackPlugin = require("html-webpack-plugin");
const {ModuleFederationPlugin} = require("webpack").container;

const path = require("path");
const deps = require("./package.json").dependencies;

module.exports = {
  entry: {
    main: [ path.resolve('.', 'src', 'index.js')]
  },
    mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "public"),
    host: '0.0.0.0',
    port: 3001,
    historyApiFallback: true
  },
  output: {
    publicPath: "http://localhost:3001/",
    chunkFilename: "[id].[contenthash].js"

  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"]
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mainApp",
      library: { type: 'var', name: 'mainAapp' },
      filename: "remoteEntry.js",
      remotes: {
        componentApp: "componentApp",

      },
      shared: { 
         ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
         "react-dom": {singleton: true}},
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
