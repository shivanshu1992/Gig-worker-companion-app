/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/welfare',
        destination: '/rights',
        permanent: false,
      },
      {
        source: '/docs',
        destination: '/documents',
        permanent: false,
      },
      {
        source: '/grievance',
        destination: '/grievances',
        permanent: false,
      },
      {
        source: '/sos',
        destination: '/safety',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

