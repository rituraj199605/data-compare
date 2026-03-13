/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    /* Rule 6: zero warnings — fail build on any warning */
    ignoreDuringBuilds: false,
  },
  typescript: {
    /* Rule 6: zero warnings — fail build on type errors */
    ignoreBuildErrors: false,
  },
  serverExternalPackages: ["xlsx"],
};

module.exports = nextConfig;
