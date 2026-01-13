/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Allow HTTPS images
        hostname: '**', // Allow images from any hostname
        port: '', // Allow default ports
        pathname: '/**', // Allow all paths
      },
    ],
  },
};

export default nextConfig;
