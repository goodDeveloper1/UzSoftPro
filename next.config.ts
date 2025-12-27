import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
  ignoreDuringBuilds: true,
},
images: {
    domains: ["framerusercontent.com"],
}}


export default nextConfig;
