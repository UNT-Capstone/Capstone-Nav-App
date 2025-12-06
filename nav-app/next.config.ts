import type { NextConfig } from 'next';

const cwd = __dirname;

const config: NextConfig = {
  reactStrictMode: true, 
  turbopack: {
    root: cwd,
  },
};

export default config;
