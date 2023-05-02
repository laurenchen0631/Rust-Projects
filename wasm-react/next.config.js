/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  webpack: function (config, options) {
      config.experiments = { asyncWebAssembly: true };
      return config;
  }
}