/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/schedule/day',
        permanent: true,
      },
      {
        source: '/schedule',
        destination: '/schedule/day',
        permanent: false,
      },
    ]
  },
}
