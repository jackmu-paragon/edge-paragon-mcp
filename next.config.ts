import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
