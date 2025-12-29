import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ["framerusercontent.com"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude unnecessary TypeORM drivers from the bundle
      config.externals.push({
        'react-native-sqlite-storage': 'react-native-sqlite-storage',
        'mysql': 'mysql',
        'mysql2': 'mysql2',
        'pg-native': 'pg-native',
        'oracledb': 'oracledb',
        'mssql': 'mssql',
        'sql.js': 'sql.js',
        'mongodb': 'mongodb',
        'better-sqlite3': 'better-sqlite3',
        'sqlite3': 'sqlite3',
        '@sap/hana-client': '@sap/hana-client',
        'hdb-pool': 'hdb-pool',
      });
    }
    return config;
  },
}

export default nextConfig;
