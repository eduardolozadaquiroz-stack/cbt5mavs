/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  // Ocultar el header "x-powered-by: Next.js" (información de servidor)
  // OWASP A05 – Security Misconfiguration
  poweredByHeader: false,

  // No generar source maps en producción (protege código fuente)
  productionBrowserSourceMaps: false,

  // Omitir ESLint durante el build de producción (se corre por separado en CI)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Omitir errores de TypeScript durante el build de producción
  typescript: {
    ignoreBuildErrors: false,
  },

  // Alias @/ explícito para que webpack lo resuelva en cualquier entorno (Render, Linux)
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
};

module.exports = nextConfig;
