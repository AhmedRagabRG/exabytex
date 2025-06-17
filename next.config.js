/** @type {import('next').NextConfig} */
const nextConfig = {
  // تحسينات الإنتاج
  compress: true,
  poweredByHeader: false,
  output: 'standalone',
  
  // إعدادات الصور
  images: {
    domains: [
      'exabytex.com',
      'www.exabytex.com',
      'res.cloudinary.com',
      'lh3.googleusercontent.com', // Google profile images
      'avatars.githubusercontent.com', // GitHub profile images
      'r2.fivemanage.com', // Discord profile images
      'cdn.discordapp.com' // Discord profile images
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // إعدادات الأمان
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          }
        ]
      }
    ]
  },

  // إعدادات التوجيه
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },

  // تحسين البناء
  experimental: {
    optimizeCss: true,
  },

  // إعدادات ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // إعدادات TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 