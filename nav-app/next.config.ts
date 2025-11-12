import type { NextConfig } from 'next';

const cwd = __dirname;

const config: NextConfig = {
  reactStrictMode: false, 
  turbopack: {
    root: cwd,
  },
};

export default config;
