/** @type {import('next').NextConfig} */
const nextConfig = { output: 'standalone', webpack: (config) => { config.externals = [...config.externals, 'openai']; return config; } };
export default nextConfig;
