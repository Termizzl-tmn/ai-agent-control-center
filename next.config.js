/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  ...(isProd && { output: 'export' }),
  distDir: isProd ? '../app' : '.next',
  images: { unoptimized: true },
  trailingSlash: true,
}
