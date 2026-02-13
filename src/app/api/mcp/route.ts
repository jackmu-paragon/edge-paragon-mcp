import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

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

	try {
		const transport = await createTransportAndConnect();
		return await transport.handleRequest(req);
	} catch (error) {
		console.error("Error handling GET request:", error);
		return Response.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request): Promise<Response> {
	console.log(`POST Request received: ${req.method} ${req.url}`);

	try {
		const transport = await createTransportAndConnect();
		const body = await req.json();
		return await transport.handleRequest(req, { parsedBody: body });
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
	}
}

export async function DELETE(req: Request): Promise<Response> {
	console.log(`DELETE Request received: ${req.method} ${req.url}`);

	try {
		const transport = await createTransportAndConnect();
		return await transport.handleRequest(req);
	} catch (error) {
		console.error("Error handling DELETE request:", error);
		return Response.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
