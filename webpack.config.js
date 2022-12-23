const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, './client/public/main.js'),
  mode: process.env.NODE_ENV,
  output: {
    path: path.join(__dirname, '/build/'),
    publicPath: '/build/',
    filename: 'bundle.js',
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'client/components/public'),
      publicPath: 'bundle.js',
    },
    proxy: {
      '/': 'http://localhost:3000',
    },
    port: 8080,
    magicHtml: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/public/index.html',
      filename: './client/public/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [`@babel/preset-env`, `@babel/preset-react`],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'file-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};
