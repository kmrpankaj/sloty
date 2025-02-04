/** @type {import('next').NextConfig} */
const nextConfig = {
      // If you're just returning CORS headers from the nextauth route,
  // you can define custom headers like so:
  async headers() {
    return [
      {
        source: "/api/auth/:path*", // All NextAuth routes
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" }, 
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
    ];
  },
};

export default nextConfig;
