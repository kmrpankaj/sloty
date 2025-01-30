/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: "/api/auth/:path*", // Match all NextAuth API calls
            destination: "https://sloty.in/api/auth/:path*", // Redirect to main auth domain
          },
        ];
      },
};

export default nextConfig;
