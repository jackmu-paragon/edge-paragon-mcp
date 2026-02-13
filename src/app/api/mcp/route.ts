import { envs } from "@/config/config";
import { createAccessTokenStore } from "@/services/access-tokens";
import { ExtendedTool, Integration } from "@/types/paragon-types";
import { getAllIntegrations } from "@/utils/actionkit";
import { getCustomTools } from "@/utils/custom-tools";
import { loadCustomOpenApiTools } from "@/utils/openapi";
import { createProxyApiTool } from "@/utils/proxy-api";
import { registerTools } from "@/utils/tools";
import { signJwt } from "@/utils/util";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { NextResponse } from "next/server";

const server = new McpServer({
	name: "edge-paragon-mcp",
	version: "1.0.0",
}, {
	capabilities: {
		logging: {},
		tools: {
			listChanged: true
		}
	}
});

let extraTools: Array<ExtendedTool> = [];
let integrations: Array<Integration> = await getAllIntegrations(
	signJwt({ userId: envs.PROJECT_ID })
);
if (envs.ENABLE_CUSTOM_OPENAPI_ACTIONS) {
	extraTools = await loadCustomOpenApiTools(integrations);
}
if (envs.ENABLE_PROXY_API_TOOL) {
	extraTools = extraTools.concat(
		createProxyApiTool(
			integrations.filter((i) => {
				if (envs.LIMIT_TO_INTEGRATIONS) {
					return envs.LIMIT_TO_INTEGRATIONS.includes(i.type);
				}
				return true;
			})
		)
	);
}
if (envs.ENABLE_CUSTOM_TOOL) {
	extraTools = extraTools.concat(getCustomTools());
}
console.log(extraTools);
registerTools({ server, extraTools });

createAccessTokenStore();

const checkAuth = (req: Request): string | null => {
	let currentJwt: string | null = req.headers.get("authorization");
	const url = new URL(req.url);
	const user: string | null = url.searchParams.get("user");

	if (currentJwt && currentJwt.startsWith("Bearer ")) {
		currentJwt = currentJwt.slice(7).trim();
	} else if (envs.NODE_ENV === "development" && user) {
		// In development, allow `user=` query parameter to be used
		currentJwt = signJwt({ userId: user as string });
	}

	return currentJwt;
}

async function createTransportAndConnect(): Promise<WebStandardStreamableHTTPServerTransport> {
	const transport = new WebStandardStreamableHTTPServerTransport({
		// No sessionIdGenerator = stateless mode
		enableJsonResponse: true,
	});

	transport.onclose = () => {
		console.log("Transport closed");
	};

	await server.connect(transport);
	return transport;
}

export async function GET(req: Request): Promise<Response> {
	console.log(`GET Request received: ${req.method} ${req.url}`);

	const jwt: string | null = checkAuth(req);
	if (!jwt) return NextResponse.json({ status: 401, message: "Unauthorized" });

	const transport = await createTransportAndConnect();
	try {
		return await transport.handleRequest(req, {
			authInfo: { token: jwt, clientId: "", scopes: [] }
		});
	} catch (error) {
		console.error("Error handling GET request:", error);
		return Response.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	} finally {
		await transport.close();
	}
}

export async function POST(req: Request): Promise<Response> {
	console.log(`POST Request received: ${req.method} ${req.url}`);

	const jwt: string | null = checkAuth(req);
	if (!jwt) return NextResponse.json({ status: 401, message: "Unauthorized" });

	const transport = await createTransportAndConnect();
	try {
		const body = await req.json();
		return await transport.handleRequest(req, {
			parsedBody: body,
			authInfo: { token: jwt, clientId: "", scopes: [] }
		});
	} catch (error) {
		console.error("Error handling POST request:", error);
		return Response.json(
			{
				jsonrpc: "2.0",
				error: {
					code: -32603,
					message: "Internal server error",
				},
				id: null,
			},
			{ status: 500 }
		);
	} finally {
		await transport.close();
	}
}

export async function DELETE(req: Request): Promise<Response> {
	console.log(`DELETE Request received: ${req.method} ${req.url}`);

	const jwt: string | null = checkAuth(req);
	if (!jwt) return NextResponse.json({ status: 401, message: "Unauthorized" });

	const transport = await createTransportAndConnect();
	try {
		return await transport.handleRequest(req, {
			authInfo: { token: jwt, clientId: "", scopes: [] }
		});
	} catch (error) {
		console.error("Error handling DELETE request:", error);
		return Response.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	} finally {
		await transport.close();
	}
}
