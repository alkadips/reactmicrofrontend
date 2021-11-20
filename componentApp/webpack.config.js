const HtmlWebpackPlugin = require("html-webpack-plugin");
const {ModuleFederationPlugin} = require("webpack").container;
const path = require("path");
const deps = require("./package.json").dependencies;
module.exports = {
  entry: {
    main: [ path.resolve('.', 'src', 'index.js')]
  },
  mode: "development",
  resolve: {
    alias: {
      src: path.resolve('.', 'src')
    },
    extensions: ['*', '.js', '.jsx']
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    host: '0.0.0.0',
    port: 3002,
    historyApiFallback: true

  },
  output: {
    publicPath: "http://localhost:3002/",
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
      name: "componentApp",
      library: { type: 'var', name: 'componentApp' },
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/Button",
      },
      remotes: {
        mainApp: "mainApp"
      },
      shared: {
        ...deps,
        react: {
          eager: true,
          singleton: true,
          requiredVersion: deps.react,

        },
        'react-dom': {
          eager: true,
          singleton: true,
        },
       
        },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
