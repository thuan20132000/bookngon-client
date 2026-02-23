import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'snapslearning-bk.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withSerwist(nextConfig);
