import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { fontFamily: { serif: ['"Noto Serif SC"', 'serif'] } } },
  plugins: [],
};
export default config;
