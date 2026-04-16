/** @type {import('next').NextConfig} */
const nextConfig = {
  // Nécessaire pour le build Docker multi-stage (image minimale)
  output: 'standalone',
}

export default nextConfig
