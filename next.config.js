/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  trailingSlash: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/welcome',
        permanent: true
      }
    ];
  }
};

module.exports = config;
