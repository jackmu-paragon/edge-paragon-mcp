import { envs } from "@/config/config";
import { ExtendedTool, Integration, ProxyApiRequestToolArgs } from "@/types/paragon-types";
import { handleResponseErrors } from "@/utils/util";

export function createProxyApiTool(integrations: Integration[]): ExtendedTool {
	const integrationNames = integrations.map((i) => i.type);

	return {
		name: "CALL_API_REQUEST",
		description: `Call an API if no tool is available for an integration that matches the user's request. Always follow the following guidelines:
- Before using this tool, respond with a plan that outlines the requests that you will need to make to fulfill the user's goal.
- If you find that you need to make multiple requests to fulfill the user's goal, you can use this tool multiple times.
- If there are errors, don't give up! Try to fix them by using the response to look at the error and adjust the request body accordingly.`,
		integrationName: "general",
		integrationId: undefined,
		requiredFields: ["integration", "url", "httpMethod"],
		isOpenApiTool: false,
		inputSchema: {
			type: "object",
			properties: {
				integration: {
					type: "string",
					description: "The name of the integration to use for this request.",
					enum: integrationNames,
				},
				url: {
					type: "string",
					description:
						"Use the full URL when specifying the `url` parameter, including the base URL. It should NEVER be a relative path - always a full URL.",
				},
				httpMethod: {
					type: "string",
					enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
				},
				queryParams: {
					type: "object",
					additionalProperties: true,
				},
				headers: {
					type: "object",
					additionalProperties: {
						type: "string",
					},
					description: "Do not include any Authorization headers.",
				},
				body: {
					type: "object",
					additionalProperties: true,
				},
			},
			required: ["integration", "url", "httpMethod"],
			additionalProperties: false,
		},
	};
}

export async function performProxyApiRequest(
	args: ProxyApiRequestToolArgs,
	jwt: string
): Promise<any> {
	const queryStr = args.queryParams
		? `?${new URLSearchParams(
			Object.entries(args.queryParams).reduce((acc, [key, value]) => {
				acc[key] = String(value);
				return acc;
			}, {} as Record<string, string>)
		).toString()}`
		: "";

	const url = `${envs.PROXY_BASE_URL}/projects/${envs.PROJECT_ID}/sdk/proxy/${args.integration}`;

	const response = await fetch(url, {
		method: args.httpMethod,
		body:
			args.httpMethod.toUpperCase() === "GET"
				? undefined
				: JSON.stringify(args.body),
		headers: {
			Authorization: `Bearer ${jwt}`,
			"Content-Type": "application/json",
			"X-Paragon-Proxy-Url": `${args.url}${queryStr}`,
			...(args.integration === "slack"
				? { "X-Paragon-Use-Slack-Token-Type": "user" }
				: {}),
			...args.headers,
		},
	});

	await handleResponseErrors(response);

	return await response.text();
}

