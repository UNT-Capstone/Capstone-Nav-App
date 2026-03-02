import type { NextConfig } from 'next';
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const cwd = __dirname;

const config: NextConfig = {
  reactStrictMode: false, 
  turbopack: {
    root: cwd,
  },
  webpack: (config, { isServer }) => {
      if (isServer) {
          config.plugins = [...config.plugins, new PrismaPlugin()];
      }
      return config;
  },
};

export default config;
