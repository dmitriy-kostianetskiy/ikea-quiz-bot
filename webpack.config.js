const path = require('path');
const production = process.env.production;

module.exports = [
  env => ({
    name: 'main',
    target: 'node',
    entry: {
      app: path.resolve(__dirname, './index.ts'),
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    devtool: production ? false : 'source-map',
    mode: production ? 'production' : 'development',
    node: {
      __filename: false,
      __dirname: false
    },
    optimization: {
      minimize: false
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          loader: 'ts-loader',
          options: {
            allowTsInNodeModules: true,
            configFile: 'tsconfig.json'
          }
        },
        {
          type: 'javascript/auto',
          test: /\.mjs$/,
          use: []
        }
      ]
    },
    output: {
      filename: 'main.bundle.js',
      path: path.resolve(__dirname, 'tsc-out'),
    }
  })
];
