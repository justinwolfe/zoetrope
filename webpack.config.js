const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: './src/background.js',
    options: './src/options.js',
    popup: './src/popup.js',
    frame: './src/frame.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'options.html', to: 'options.html' },
        { from: 'options.css', to: 'options.css' },
        { from: 'popup.html', to: 'popup.html' },
        { from: 'frame.html', to: 'frame.html' },
        { from: 'icons', to: 'icons' }
      ]
    })
  ],
  optimization: {
    minimize: false // Keep readable for debugging
  }
};
