/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from local public folder
    unoptimized: false,
    remotePatterns: [],
    // Configure local paths
    localPatterns: [
      {
        pathname: '/profiles/**',
      },
      {
        pathname: '/assets/**',
      },
    ],
  },
};

export default nextConfig;
