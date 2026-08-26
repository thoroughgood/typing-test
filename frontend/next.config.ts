import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error Node middleware is not yet included in Next 15.5's config types.
    nodeMiddleware: true,
  },
};

module.exports = {
  images: {
    remotePatterns: [
      new URL('https://lh3.googleusercontent.com/a/**'),
      new URL('https://s.gravatar.com'),
    ],
  },
};

export default nextConfig;
