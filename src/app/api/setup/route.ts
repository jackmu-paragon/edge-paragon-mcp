import { envs } from "@/config/config";
import { getAccessTokenById } from "@/services/access-tokens";
import { getSigningKey } from "@/utils/util";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const tokenId: string | null = url.searchParams.get("token");
	if (!tokenId || typeof tokenId !== "string") {
		return NextResponse.json({ error: "Invalid token" }, { status: 400 });
	}

	const token = getAccessTokenById(tokenId);
	if (!token) {
		return NextResponse.json({ error: "Invalid token" }, { status: 400 });
	}

	try {
		jwt.verify(token, getSigningKey());
	} catch (error) {
		return NextResponse.json({ error: "Invalid token" }, { status: 400 });
	}

	const decoded = jwt.decode(token, { complete: true });
	if (!decoded?.payload || typeof decoded.payload === "string") {
		return NextResponse.json({ error: "Invalid token" }, { status: 400 });
	}

	const payload = decoded.payload.payload;
	const tokenInfo = {
		projectId: payload.projectId,
		loginToken: payload.loginToken,
		integrationName: payload.integrationName,
	};

	const html = `
      <html>
        <head>
          <script src="${envs.CONNECT_SDK_CDN_URL}"></script>
          <script id="token-info" type="application/json">${JSON.stringify(tokenInfo)}</script>
          <script type="text/javascript" src="/static/js/index.js"></script>
        </head>
        <body>
        </body>
      </html>
    `;

	return new Response(html, {
		status: 200,
		headers: {
			"Content-Type": "text/html",
		},
	});
}
