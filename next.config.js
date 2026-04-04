/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.pandascore.co' },
      { protocol: 'https', hostname: 'app.pandascore.co' },
      { protocol: 'https', hostname: 'static.pandascore.io' },
      { protocol: 'https', hostname: '*.pandascore.co' },
    ],
  },
};

module.exports = nextConfig;
