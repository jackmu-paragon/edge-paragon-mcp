import { z } from "zod";

export const envs = z.object({
	MCP_SERVER_URL: z.string().default(`http://localhost:3001`),
	PROJECT_ID: z.string(),
	SIGNING_KEY: z.string().optional(),
	SIGNING_KEY_PATH: z.string().optional(),
	PORT: z.string().default("3001"),
	ZEUS_BASE_URL: z.string().default("https://zeus.useparagon.com"),
	PROXY_BASE_URL: z.string().default("https://proxy.useparagon.com"),
	CONNECT_SDK_CDN_URL: z
		.string()
		.default("https://cdn.useparagon.com/latest/sdk/index.js"),
	ACTIONKIT_BASE_URL: z.string().default("https://actionkit.useparagon.com"),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	ENABLE_CUSTOM_OPENAPI_ACTIONS: z.coerce.boolean().default(false),
	ENABLE_PROXY_API_TOOL: z.coerce.boolean().default(false),
	ENABLE_CUSTOM_TOOL: z.coerce.boolean().default(false),
	LIMIT_TO_INTEGRATIONS: z
		.string()
		.default("")
		.transform((val) =>
			val
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean)
		),
	LIMIT_TO_TOOLS: z
		.string()
		.default("")
		.transform((val) =>
			val
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean)
		),
}).parse(process.env);
