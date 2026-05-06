import { withSentryConfig } from "@sentry/nextjs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  webpack(config) {
    config.resolve.alias["@"] = __dirname;
    return config;
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG ?? "",
  project: process.env.SENTRY_PROJECT ?? "",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring-tunnel",
});
