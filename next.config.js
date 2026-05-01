/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ocultar el header "x-powered-by: Next.js" (información de servidor)
  // OWASP A05 – Security Misconfiguration
  poweredByHeader: false,

  // No generar source maps en producción (protege código fuente)
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
