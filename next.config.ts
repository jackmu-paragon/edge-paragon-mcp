import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
				pathname: "/useparagon/**",
			},
		],
	},
	async rewrites() {
		return [
			{
				source: "/mcp",
				destination: "/api/mcp",
			},
			{
				source: "/setup",
				destination: "/api/setup",
			},
		];
	},
};

export default nextConfig;
