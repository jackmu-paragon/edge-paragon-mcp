import { envs } from "../config/config.js";
import { ExtendedTool } from "../types/paragon-types.js";
import { openApiRequests } from "./openapi.js";
import { handleResponseErrors } from "./util.js";
import { OpenAPIV3 } from "openapi-types";

export async function getActions(jwt: string): Promise<any | null> {
	try {
		const url = `${envs.ACTIONKIT_BASE_URL}/projects/${envs.PROJECT_ID}/actions?limit_to_available=false`;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
		});

		await handleResponseErrors(response);
		return await response.json();
	} catch (error) {
		console.error("Could not make ActionKit POST request: " + error);
		return null;
	}
}

export async function performOpenApiAction(
	action: ExtendedTool,
	actionParams: { params: any; body: any },
	jwt: string
): Promise<any | null> {
	const request = openApiRequests[action.name];
	if (!request) {
		throw new Error(`No request found for action ${action.name}`);
	}

	const resolvedRequestPath = `${request.baseUrl ? request.baseUrl : ""
		}${request.path.replace(
			/\{(\w+)\}/g,
			(_match: string, p1: string) => actionParams.params[p1]
		)}`;

	let url = `${envs.PROXY_BASE_URL}/projects/${envs.PROJECT_ID}/sdk/proxy/${action.integrationName}`;
	const urlParams = new URLSearchParams(
		request.params
			.filter((param) => param.in === "query")
			.filter((param) => actionParams.params[param.name])
			.map((param) => [param.name, actionParams.params[param.name]])
	);

	const response = await fetch(url, {
		method: request.method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwt}`,
			"X-Paragon-Proxy-Url": resolvedRequestPath.concat(
				`?${urlParams.toString()}`
			),
			"X-Paragon-Use-Raw-Response": "true",
		},
		body:
			request.method.toLowerCase() === OpenAPIV3.HttpMethods.GET
				? undefined
				: JSON.stringify(actionParams.body),
	});
	await handleResponseErrors(response);
	return await response.text();
}

export async function performAction(
	actionName: string,
	actionParams: any,
	jwt: string
): Promise<any | null> {
	console.log(`DEBUG:`, "Running action", actionName, actionParams);
	try {
		const url = `${envs.ACTIONKIT_BASE_URL}/projects/${envs.PROJECT_ID}/actions`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
			body: JSON.stringify({ action: actionName, parameters: actionParams }),
		});
		await handleResponseErrors(response);

		return await response.json();
	} catch (error) {
		throw error;
	}
}

export async function getAllIntegrations(jwt: string): Promise<any | null> {
	try {
		const response = await fetch(
			`${envs.ZEUS_BASE_URL}/projects/${envs.PROJECT_ID}/sdk/integrations`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + jwt,
				},
			}
		);
		return await response.json();
	} catch (err) {
		console.error(err);
		return null;
	}
}


