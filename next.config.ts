import allowedImageDomains from './allowedImageDomains';

const nextConfig = {
  images: {
    remotePatterns: allowedImageDomains.map((hostname) => ({
      protocol: 'https',
      hostname: hostname,
      pathname: '**',
    })),
  },
};

module.exports = nextConfig;
