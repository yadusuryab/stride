const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allows all hostnames
      },
    ],
  },
};

export default nextConfig;
