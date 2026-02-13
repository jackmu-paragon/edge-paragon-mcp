import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { envs } from './config/config';

// This function can be marked `async` if using `await` inside
export function proxy(req: NextRequest) {
	let currentJwt: string | null = req.headers.get("authorization");
	const user: string | null = req.nextUrl.searchParams.get("user");

	const prodAuth: boolean = (currentJwt !== null && currentJwt.startsWith("Bearer "));
	const devAuth: boolean = envs.NODE_ENV === "development" && user !== null;

	if (!prodAuth && !devAuth) return NextResponse.json({ status: 401, message: "Unauthorized" });
}

export const config = { matcher: ['/api/mcp/:path*'] };
