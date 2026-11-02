/** @type {import('next').NextConfig} */
const nextConfig = {
  // Salida minima para correr en Docker
  output: "standalone",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
