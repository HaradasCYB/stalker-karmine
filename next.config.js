/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.pandascore.co' },
      { protocol: 'https', hostname: 'app.pandascore.co' },
      { protocol: 'https', hostname: 'cdnb.artstation.com' },
    ],
  },
};

module.exports = nextConfig;
