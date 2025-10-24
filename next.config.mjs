/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suprimir warnings de atributos extra del servidor
  reactStrictMode: true,
  // Configuración para el compilador
  compiler: {
    // Suprimir warnings de atributos extra
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable dynamic rendering for pages that use dynamic data
  dynamicParams: true,
};

export default nextConfig;
