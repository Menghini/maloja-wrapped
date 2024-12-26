import type { NextConfig } from "next";
import { MalojaURL } from './malojaWrapped.config';


module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${MalojaURL}/apis/mlj_1/:path*`, // Proxy to Backend
      },
    ];
  },
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
