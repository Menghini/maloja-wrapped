import type { NextConfig } from "next";

module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://MalojaURLHere:42010/apis/mlj_1/:path*", // Proxy to Backend
      },
    ];
  },
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
