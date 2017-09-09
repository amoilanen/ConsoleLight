const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
      'icons'
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(ttf|eot|svg|woff)$/,
        use: 'file-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ 'es2015' ],
            plugins: [
              [
                'transform-react-jsx',
                {
                  'pragma': 'h'
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin()]
};