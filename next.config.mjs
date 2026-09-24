/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'play-lh.googleusercontent.com' },
      { protocol: 'https', hostname: 'blogger.googleusercontent.com' },
      { protocol: 'https', hostname: '*.bp.blogspot.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
}
export default nextConfig
