/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com/**",
      },
      {
        protocol: "https",
        hostname: "content-anteater-991.convex.cloud/**",
      },
    ],
  },
};

export default nextConfig;
