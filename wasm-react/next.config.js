/** @type {import('next').NextConfig} */
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')
const path = require('path');

const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  webpack: function (config, options) {
      config.experiments = {
        asyncWebAssembly: true,
        layers: true,
      };

      config.module.rules.push({
        test: /\.wasm$/,
        type: 'webassembly/async',
      });

      config.plugins.push(
        new WasmPackPlugin({
          crateDirectory: path.resolve(__dirname, 'wasm'),
        })
      );
      return config;
  }
}