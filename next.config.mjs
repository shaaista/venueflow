/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
  // Demo build: types are validated separately via `tsc`; don't let lint
  // warnings (e.g. unescaped entities) block the production build.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
