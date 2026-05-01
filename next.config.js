/** @type {import('next').NextConfig} */
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
};

module.exports = nextConfig;
