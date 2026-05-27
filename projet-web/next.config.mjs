/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/produits',
        destination: 'http://localhost:3001/produits',
      },
      {
        source: '/api/produits/:id',
        destination: 'http://localhost:3001/produits/:id',
      },
    ];
  },
};

export default nextConfig;