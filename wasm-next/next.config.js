/** @type {import('next').NextConfig} */
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      // layers: true,
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

module.exports = nextConfig
