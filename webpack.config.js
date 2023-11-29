const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle file
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this rule to .js files
        exclude: /node_modules/, // Exclude node_modules directory
        use: 'babel-loader', // Use the babel-loader for transpilation
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // File extensions to resolve
    fallback: {
      'zlib': require.resolve('browserify-zlib'),
      'async_hooks': require.resolve('async_hooks-browserify'),
      'path': require.resolve('path-browserify'),
      'crypto': require.resolve('crypto-browserify'),
      'fs': false, // Or require.resolve("fs-browserify") if needed
      'http': require.resolve('stream-http'),
      'stream': require.resolve('stream-browserify'),
    },
  },
  plugins: [
    // Add the following plugin for polyfilling core Node.js modules
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
