import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import fs from 'fs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: '../out',
  webpack: (config, { isServer }) => {
    if (isServer) {

      const cnd = fs.existsSync(path.resolve('./md'));

      const sourceDir = cnd
        ? path.resolve('./md')
        : path.resolve('./src/md')
      ;
      const destinDir = cnd
        ? path.resolve('./.next/server/md')
        : path.resolve('./src/.next/server/md')
      ;

      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: sourceDir,
              to: path.resolve('./.next/server/md'),
            },
          ],
        })
      );
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
