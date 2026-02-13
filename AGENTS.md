# AGENTS.md - Coding Agent Guidelines

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

Edge Paragon MCP is a Model Context Protocol (MCP) server built with Next.js 16 that exposes Paragon integration tools to AI agents. It provides ActionKit tools, OpenAPI-based custom tools, and proxy API capabilities.

## Build/Lint/Test Commands

### Package Manager
```bash
npm install          # Install dependencies
```

### Development
```bash
npm run dev          # Start development server (default: localhost:3001)
```

### Build & Production
```bash
npm run build        # Build for production
npm run start        # Start production server
```

### Linting
```bash
npm run lint         # Run ESLint (next/core-web-vitals + typescript)
```

### Testing
No test framework is currently configured. When adding tests:
- Recommended: Vitest or Jest with `@testing-library/react`
- Place test files adjacent to source files as `*.test.ts` or in `__tests__/` directories
- Run single test: `npx vitest run path/to/file.test.ts` (if Vitest is added)

## Code Style Guidelines

### File Naming
- Use **kebab-case** for all files: `access-tokens.ts`, `proxy-api.ts`, `paragon-types.ts`
- React components: `page.tsx`, `layout.tsx` (Next.js App Router conventions)

### Naming Conventions
- **Functions/Variables**: camelCase (`getSigningKey`, `currentJwt`)
- **Interfaces/Types**: PascalCase (`ExtendedTool`, `Integration`, `LinkConnectionProps`)
- **Constants (tool names)**: SCREAMING_SNAKE_CASE (`CALL_API_REQUEST`, `CUSTOM_NOTION_CREATE_PAGE`)

### Imports
Order imports as follows:
1. External packages (npm dependencies)
2. Internal modules using path alias `@/*`

```typescript
// External packages first
import { z } from "zod";
import jwt from "jsonwebtoken";

// Internal modules with @/* alias
import { envs } from "@/config/config";
import { ExtendedTool } from "@/types/paragon-types";
import { getActions } from "@/utils/actionkit";
```

**Important**: MCP SDK imports require `.js` extensions for ESM compatibility:
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
```

### Formatting
- **Indentation**: Tabs (not spaces)
- **Semicolons**: Required
- **Quotes**: Double quotes for strings
- **Trailing commas**: Use in multiline arrays/objects

### TypeScript Patterns

#### Type Definitions
- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, or simple aliases
- Prefer explicit return types on exported functions

```typescript
// Interface for extendable objects
export interface ExtendedTool extends Tool {
	integrationName: string;
	integrationId?: string;
	requiredFields: string[];
	isOpenApiTool: boolean;
}

// Type for unions
export type Integration =
	| (BaseIntegration & { type: "custom"; customIntegration: CustomIntegration })
	| (BaseIntegration & { type: string; customIntegration: CustomIntegration | null });
```

#### Environment Variables
Validate with Zod at startup in `src/config/config.ts`:
```typescript
export const envs = z.object({
	PROJECT_ID: z.string(),
	SIGNING_KEY: z.string().optional(),
	ENABLE_PROXY_API_TOOL: z.coerce.boolean().default(false),
}).parse(process.env);
```

### Error Handling

#### Custom Error Classes
Define in `src/errors/errors.ts`:
```typescript
export class JsonResponseError extends Error {
	public jsonResponse: any;

	constructor(message: string, jsonResponse: any) {
		super(message);
		this.jsonResponse = jsonResponse;
		this.name = "JsonResponseError";
	}
}
```

#### Error Handling Patterns
- Use try-catch with specific error type handling
- Re-throw errors with context when appropriate
- Log errors with `console.error()` before handling

```typescript
try {
	return fs.readFileSync(envs.SIGNING_KEY_PATH, "utf8");
} catch (error) {
	console.error("Error reading signing key file:", error);
	throw new Error("Failed to read signing key file");
}
```

### Async/Await
- Always use async/await for asynchronous operations
- Avoid mixing promises with callbacks

```typescript
export async function getTools(jwt: string): Promise<Array<ExtendedTool>> {
	const actionPayload = await getActions(jwt);
	// ...
}
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── mcp/route.ts   # Main MCP endpoint (GET/POST/DELETE)
│   │   └── setup/route.ts # Integration setup endpoint
│   ├── layout.tsx
│   └── page.tsx
├── config/
│   └── config.ts          # Environment config (Zod validation)
├── errors/
│   └── errors.ts          # Custom error classes
├── services/
│   └── access-tokens.ts   # Token storage (node-cache)
├── types/
│   └── paragon-types.ts   # TypeScript interfaces
└── utils/
    ├── actionkit.ts       # ActionKit API interactions
    ├── custom-tools.ts    # Custom tool definitions
    ├── openapi.ts         # OpenAPI spec to tools converter
    ├── proxy-api.ts       # Proxy API tool
    ├── tools.ts           # MCP tool registration
    └── util.ts            # JWT signing, helpers
```

## Key Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PROJECT_ID` | Yes | Paragon project ID |
| `SIGNING_KEY` | One of these | RS256 private key for JWT signing |
| `SIGNING_KEY_PATH` | One of these | Path to private key file |
| `MCP_SERVER_URL` | No | Server URL (default: localhost:3001) |
| `ENABLE_CUSTOM_OPENAPI_ACTIONS` | No | Enable OpenAPI tools |
| `ENABLE_PROXY_API_TOOL` | No | Enable proxy API tool |
| `ENABLE_CUSTOM_TOOL` | No | Enable custom hardcoded tools |
| `LIMIT_TO_INTEGRATIONS` | No | Comma-separated integration filter |
| `LIMIT_TO_TOOLS` | No | Comma-separated tool filter |

## Common Patterns

### API Route Handlers
```typescript
export async function POST(req: Request): Promise<Response> {
	const jwt = checkAuth(req);
	if (!jwt) return NextResponse.json({ status: 401, message: "Unauthorized" });

	try {
		// Handle request
	} catch (error) {
		console.error("Error handling POST request:", error);
		return Response.json({ error: "Internal server error" }, { status: 500 });
	}
}
```

### Adding New Tools
1. Define tool in `src/utils/custom-tools.ts` or `src/utils/proxy-api.ts`
2. Register in `src/utils/tools.ts` using MCP SDK patterns
3. Add feature flag in `src/config/config.ts` if conditional

## Dependencies of Note

- `@modelcontextprotocol/sdk`: MCP server implementation
- `zod`: Runtime schema validation
- `jsonwebtoken`: JWT signing/verification (RS256)
- `ajv`: JSON Schema validation for OpenAPI tools
- `node-cache`: In-memory token caching
