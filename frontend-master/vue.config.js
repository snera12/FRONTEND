const path = require('path');
const { defineConfig } = require('@vue/cli-service');
const IS_PROD = process.env.NODE_ENV === 'production';
module.exports = defineConfig({
  productionSourceMap: false,
  transpileDependencies: true,
  devServer: {
    open: true,
    port: 3003,
    host: 'devlocalhost',
    headers: {"Access-Control-Allow-Origin": "*"},
  },
  filenameHashing: false,
  pages: {
    app: {
      entry: path.resolve(__dirname, './src/main.js'),
    }
  },
  css: {
    extract: {
      filename: 'css/[name].css',
    },
    loaderOptions: {
      css: {
        url: !IS_PROD,
      },
    },
  },
  configureWebpack: {
    experiments: {
      topLevelAwait: true,
    },
    output: {
      filename: 'js/[name].js',
    }
  },
  // },
  publicPath: '',
  // publicPath: process.env.NODE_ENV === 'production' ? 'production path' : 'development path'
});