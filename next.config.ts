import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  serverExternalPackages: ['knex', 'pg', 'pg-query-stream'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore optional database drivers that Knex tries to load on server
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(better-sqlite3|mysql|mysql2|oracledb|sqlite3|tedious)$/,
        })
      );
    }

    return config;
  },
};

export default nextConfig;
