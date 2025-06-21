/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  swcMinify: false,
  experimental: {
    workerThreads: false,
    cpus: 1
  }
}

module.exports = nextConfig