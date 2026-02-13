import { envs } from "@/config/config";
import fs from "fs";
import { ExtendedTool, LinkConnectionProps } from "@/types/paragon-types";
import jwt from "jsonwebtoken";
import { getActions } from "@/utils/actionkit";
import { UserNotConnectedError } from "@/errors/errors";
import { createAccessToken } from "@/services/access-tokens";

export function getSigningKey(): string {
	if (envs.SIGNING_KEY_PATH) {
		try {
			return fs
				.readFileSync(envs.SIGNING_KEY_PATH, "utf8")
				.replaceAll("\\n", "\n");
		} catch (error) {
			console.error("Error reading signing key file:", error);
			throw new Error("Failed to read signing key file");
		}
	}

	if (!envs.SIGNING_KEY) {
		throw new Error("Neither SIGNING_KEY nor SIGNING_KEY_PATH is set");
	}

	return envs.SIGNING_KEY.replaceAll("\\n", "\n");
}

export function signJwt({
	userId,
	personaId,
	integrationId,
	integrationName,
	projectId,
	loginToken,
}: LinkConnectionProps): string {
	const currentTime = Math.floor(Date.now() / 1000);
	const signingKey = getSigningKey();

	return jwt.sign(
		{
			payload: {
				...(personaId && { personaId }),
				...(integrationId && { integrationId }),
				...(integrationName && { integrationName }),
				...(projectId && { projectId }),
				...(loginToken && { loginToken }),
			},
			sub: userId,
			iat: currentTime,
			exp: currentTime + 60 * 60 * 24 * 7, // 1 week from now
		},
		signingKey,
		{
			algorithm: "RS256",
		}
	);
}

export function decodeJwt(token: string) {
	return jwt.decode(token, { complete: true });
}

export async function getTools(jwt: string): Promise<Array<ExtendedTool>> {
	const tools: Array<ExtendedTool> = [];
	const actionPayload = await getActions(jwt);
	const actions = actionPayload.actions;

	for (const integration of Object.keys(actions)) {
		for (const action of actions[integration]) {
			const tool: ExtendedTool = {
				isOpenApiTool: false,
				name: action["function"]["name"],
				description: action["function"]["description"],
				inputSchema: action["function"]["parameters"],
				integrationName: integration,
				requiredFields: action["function"]["parameters"]["required"],
			};
			tools.push(tool);
		}
	}
	return tools;
}

export async function generateSetupLink({
	integrationName,
	projectId,
	userId,
}: LinkConnectionProps) {
	const loginToken = signJwt({
		userId,
	});
	const token = signJwt({
		integrationName,
		projectId,
		loginToken,
	});

	const id = createAccessToken(token);

	return `${envs.MCP_SERVER_URL}/setup?token=${id}`;
}

/**
 * 1 minute in seconds
 */
export const MINUTES = 60;

export async function handleResponseErrors(response: Response): Promise<void> {
	if (!response.ok) {
		let bodyText = "";
		try {
			bodyText = await response.text();
		} catch { }

		const parsedBody = parseJsonOrNull(bodyText);
		const message = determineMessage(parsedBody, bodyText);

		if (message.includes("Integration not enabled for user.")) {
			throw new UserNotConnectedError("Integration not enabled for user.");
		}

		throw new Error(
			`HTTP error; status: ${response.status}; message: ${message}`
		);
	}

	function parseJsonOrNull(text: string): unknown | null {
		if (!text) return null;
		try {
			return JSON.parse(text);
		} catch {
			return null;
		}
	}

	function hasMessageString(val: unknown | null): val is { message: string } {
		return (
			typeof val === "object" &&
			val !== null &&
			"message" in (val as Record<string, unknown>) &&
			typeof (val as Record<string, unknown>).message === "string"
		);
	}

	function safeStringify(value: unknown): string {
		try {
			const seen = new WeakSet<object>();
			return JSON.stringify(value, (_key, val: unknown) => {
				if (typeof val === "object" && val !== null) {
					const obj = val as object;
					if (seen.has(obj)) return "[Circular]";
					seen.add(obj);
				}
				return val as unknown;
			});
		} catch {
			return String(value);
		}
	}

	function determineMessage(
		parsed: unknown | null,
		fallbackText: string
	): string {
		if (hasMessageString(parsed)) return parsed.message;
		if (parsed !== null) return safeStringify(parsed);
		return fallbackText;
	}
}

export const Logger = {
	debug: (...args: any[]) => {
		if (envs.NODE_ENV !== "development") {
			return;
		}

		console.log(`DEBUG:`, ...args);
	},
};
