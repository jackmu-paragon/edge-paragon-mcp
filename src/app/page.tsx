import styles from "./page.module.css";

export default function Home() {
	return (
		<div className={styles.page}>
			<article className={styles.content}>
				<header className={styles.header}>
					<img
						src="https://raw.githubusercontent.com/useparagon/aws-on-prem/master/assets/paragon-logo-dark.png"
						alt="Paragon Logo"
						className={styles.logo}
					/>
					<p className={styles.tagline}>
						The embedded integration platform for developers.
					</p>
				</header>

				<hr className={styles.divider} />

				<h1>Paragon MCP Server (Serverless)</h1>

				<p>
					This is an <strong>experimental serverless</strong> implementation for
					Model Context Protocol (MCP) that integrates with{" "}
					<a href="https://useparagon.com/actionkit">ActionKit</a>, an API by
					Paragon that provides access to prebuilt actions for 130+ integrations
					to your users&apos; SaaS applications.
				</p>

				<p>
					For a self-hostable <strong>server</strong> implementation, please
					visit the official{" "}
					<a href="https://github.com/useparagon/paragon-mcp">Paragon MCP</a>
				</p>

				<h2>Deploy to your Vercel Account</h2>

				<p>
					This serverless MCP can be self-hosted and deployed directly to your
					Vercel account for immediate testing.
				</p>

				<a
					href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjackmu-paragon%2Fedge-paragon-mcp&env=PROJECT_ID,SIGNING_KEY,MCP_SERVER_URL,NODE_ENV,ENABLE_CUSTOM_OPENAPI_ACTIONS,ENABLE_PROXY_API_TOOL,ENABLE_CUSTOM_TOOL&envDefaults=%7B%22MCP_SERVER_URL%22%3A%22REPLACE_WITH_YOUR_DOMAIN%20(may%20have%20to%20replace%20after%20deploying%20if%20you%20don't%20have%20a%20static%20url)%22%2C%22NODE_ENV%22%3A%22production%22%2C%22ENABLE_CUSTOM_OPENAPI_ACTIONS%22%3A%22false%22%2C%22ENABLE_PROXY_API_TOOL%22%3A%22false%22%2C%22ENABLE_CUSTOM_TOOL%22%3A%22false%22%7D&project-name=paragon-mcp-serverless&demo-title=Paragon%20MCP%20(serverless)"
					className={styles.deployButton}
				>
					<img
						src="https://vercel.com/button"
						alt="Deploy with Vercel"
					/>
				</a>

				<h2>Features</h2>

				<ul>
					<li>
						Add user-facing integrations from your Paragon account as available
						capabilities to your agent, for example:
						<ul>
							<li>
								<strong>Google Calendar</strong>: Create or update events and
								get calendar availability on your user&apos;s behalf.
							</li>
							<li>
								<strong>Salesforce</strong>: Query and manage records from your
								user&apos;s CRM.
							</li>
							<li>
								<strong>Slack</strong>: Send notifications to your user&apos;s
								Slack workspace.
							</li>
						</ul>
					</li>
					<li>
						Automatically prompt users to authorize integrations with the{" "}
						<a href="https://docs.useparagon.com/getting-started/displaying-the-connect-portal">
							Connect Portal
						</a>
						, a prebuilt component for secure OAuth 2.0 and API Key intake
						flows.
					</li>
					<li>
						Optionally: add{" "}
						<a href="#adding-custom-actions-with-openapi">Custom Actions</a> or{" "}
						<a href="#using-experimental-proxy-api-tool">direct API access</a>{" "}
						as available tools in the MCP.
					</li>
				</ul>

				<h2>Prerequisites</h2>

				<p>
					To start using the Paragon MCP Server, you will need to{" "}
					<a href="https://dashboard.useparagon.com/signup">
						sign up and register for a Paragon account
					</a>
					.
				</p>

				<ul>
					<li>Node.js @ 22.14.0</li>
					<li>npm package manager</li>
				</ul>

				<h2>Installation</h2>

				<ol>
					<li>Clone the repository</li>
					<li>Install dependencies:</li>
				</ol>

				<pre className={styles.code}>
					<code>npm install</code>
				</pre>

				<h3>Environment Variables</h3>

				<p>
					Create a <code>.env</code> file in the root directory by running:
				</p>

				<pre className={styles.code}>
					<code>cp .env.example .env</code>
				</pre>

				<p>Set up the environment variables as described below:</p>

				<ul>
					<li>
						<strong>Required:</strong>
						<ul>
							<li>
								<code>PROJECT_ID</code>: Your Paragon project ID
							</li>
							<li>
								<code>SIGNING_KEY</code>: Your JWT signing key (required if
								SIGNING_KEY_PATH is not set)
							</li>
							<li>
								<code>SIGNING_KEY_PATH</code>: Path to your JWT signing key file
								(required if SIGNING_KEY is not set)
							</li>
						</ul>
					</li>
					<li>
						<strong>Optional:</strong>
						<ul>
							<li>
								<code>LIMIT_TO_INTEGRATIONS</code>: Comma-separated list of
								integration names to limit the types of available tools.
							</li>
							<li>
								<code>LIMIT_TO_TOOLS</code>: Comma-separated list of tool names
								to additionally limit available tools if needed.
							</li>
							<li>
								<code>PORT</code>: Server port (default: 3001)
							</li>
							<li>
								<code>MCP_SERVER_URL</code>: The URL of your hosted MCP Server.
								This will be used to generate Setup Links when your users are
								prompted to install integrations. (default:{" "}
								<code>http://localhost:3001</code>)
							</li>
							<li>
								<code>CONNECT_SDK_CDN_URL</code>: Paragon Connect SDK CDN URL
								(default: https://cdn.useparagon.com/latest/sdk/index.js)
							</li>
							<li>
								<code>ACTIONKIT_BASE_URL</code>: Paragon ActionKit base URL
								(default: https://actionkit.useparagon.com)
							</li>
							<li>
								<code>ZEUS_BASE_URL</code>: Paragon API base URL (default:
								https://zeus.useparagon.com)
							</li>
							<li>
								<code>PROXY_BASE_URL</code>: Paragon Proxy API base URL
								(default: https://proxy.useparagon.com)
							</li>
							<li>
								<code>NODE_ENV</code>: Node environment (default:{" "}
								<code>development</code>)
								<br />
								<small>
									<strong>Note</strong>: When <code>NODE_ENV</code> is set to{" "}
									<code>development</code>, the <code>/sse</code> parameter
									accepts any user ID in the <code>?user=</code> query parameter
									to automatically authorize as a specific user while testing
									locally.
								</small>
							</li>
						</ul>
					</li>
				</ul>

				<h3>Running the Server</h3>

				<p>Start the server using:</p>

				<pre className={styles.code}>
					<code>npm run dev</code>
				</pre>

				<p>
					The server will start on <code>http://localhost:3001</code> by
					default.
				</p>

				<h2>Client Configuration</h2>

				<blockquote className={styles.note}>
					<strong>Note:</strong> Cursor&apos;s MCP implementation is a very new
					protocol and is still in active development. You might encounter
					unexpected issues. When making changes to the MCP server URL, a full
					client restart is recommended. For more information about current
					limitations, see the{" "}
					<a href="https://docs.cursor.com/context/model-context-protocol#limitations">
						Cursor MCP documentation
					</a>
					.
				</blockquote>

				<h3>Cursor</h3>

				<p>
					To use this MCP server with Cursor, add the following to your Cursor
					configuration file at <code>~/.cursor/mcp.json</code>:
				</p>

				<pre className={styles.code}>
					<code>{`{
  "mcpServers": {
    "mcp-actionkit-dev": {
      "url": "http://localhost:3001/sse?user=[user-id]"
    }
  }
}`}</code>
				</pre>

				<p>Replace:</p>
				<ul>
					<li>
						<code>http://localhost:3001</code> with your server&apos;s domain
					</li>
					<li>
						<code>user-id</code> with the ID for the Connected User to use with
						ActionKit (this parameter only available in development mode)
					</li>
				</ul>

				<h3>Claude</h3>

				<p>
					To use this MCP server with Claude, add the following to your Claude
					configuration file at{" "}
					<code>
						~/Library/Application Support/Claude/claude_desktop_config.json
					</code>
					:
				</p>

				<pre className={styles.code}>
					<code>{`{
  "mcpServers": {
    "actionkit": {
      "command": "npx",
      "args": ["mcp-remote", "http://localhost:3001/sse?user=[user-id]"]
    }
  }
}`}</code>
				</pre>

				<p>Replace:</p>
				<ul>
					<li>
						<code>http://localhost:3001</code> with your server&apos;s domain
					</li>
					<li>
						<code>user-id</code> with the ID for the Connected User to use with
						ActionKit (this parameter only available in development mode)
					</li>
				</ul>

				<h2>API Endpoints</h2>

				<ul>
					<li>
						<code>GET /mcp</code>: Establishes Streamable HTTP connection for
						MCP communication
					</li>
					<li>
						<code>POST /mcp</code>: Handles MCP message processing
					</li>
					<li>
						<code>GET /setup</code>: Handles integration setup flow
					</li>
				</ul>

				<h3>Authorization</h3>

				<p>
					The <code>GET /mcp</code> endpoint (base URL for the MCP using the
					Streamable HTTP transport) accepts an <code>Authorization</code>{" "}
					header with a Paragon User Token as the Bearer token.
				</p>

				<p>
					The Paragon User Token is an RS256-encoded JWT that is verified using
					the public key stored by Paragon. Your MCP client (e.g. your
					application server or the service running your AI agent) will sign the
					User Token using the matching private key generated in the Paragon
					dashboard, which only your server has access to.
				</p>

				<p>
					This allows the MCP to validate the authenticity of the requesting
					user using the JWT signature and public key. Once authenticated, the
					MCP will associate the user ID encoded in the JWT with the active MCP
					session.
				</p>

				<h2 id="adding-custom-actions-with-openapi">
					Adding Custom Actions with OpenAPI
				</h2>

				<p>To add your own Custom Action definitions:</p>

				<ol>
					<li>
						Set <code>ENABLE_CUSTOM_OPENAPI_ACTIONS=true</code> in your
						environment (e.g. .env file).
					</li>
					<li>
						Create an <code>openapi/</code> subfolder at the root of the
						repository.
					</li>
					<li>
						Add OpenAPI specs in YAML or JSON format, using the integration name
						as the file name.
						<ul>
							<li>
								For example, if you are adding Custom Actions for Google
								Calendar, the OpenAPI specs should be located at:{" "}
								<code>openapi/googleCalendar.json</code>.
							</li>
							<li>
								If you are adding Actions for a Custom Integration, use the SDK
								name of the integration, with the <code>custom.</code> prefix:{" "}
								<code>openapi/custom.spotify.json</code>.
							</li>
						</ul>
					</li>
				</ol>

				<p>
					The MCP will automatically match OpenAPI files with Active
					integrations in your Paragon project to augment the list of available
					tools returned by the MCP.
				</p>

				<h2 id="using-experimental-proxy-api-tool">
					Using experimental Proxy API tool
				</h2>

				<blockquote className={styles.warning}>
					<strong>Warning:</strong> Enabling this tool allows your agent to
					write its own API requests with the account you connect. Always review
					the request before allowing the agent to use this tool to safeguard
					against unexpected changes.
				</blockquote>

				<p>
					To allow the agent to write its own requests to the integration API,
					set <code>ENABLE_PROXY_API_TOOL=true</code> in your environment.
				</p>

				<h2>License</h2>

				<p>
					This project is open source and available under the{" "}
					<a href="https://opensource.org/license/mit">MIT License</a>.
				</p>
			</article>
		</div>
	);
}
