import type { NextConfig } from 'next';

const cwd = __dirname;

const config: NextConfig = {
  // rest of your config
  turbopack: {
    root: cwd
  }
};

// module.exports = config;
export default config;