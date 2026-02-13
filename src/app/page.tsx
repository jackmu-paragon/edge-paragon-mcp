import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<a
					href="https://useparagon.com"
					target="_blank"
					rel="noopener noreferrer"
					className={styles.logo}
				>
					<Image
						src="https://raw.githubusercontent.com/useparagon/aws-on-prem/master/assets/paragon-logo-dark.png"
						alt="Paragon Logo"
						width={120}
						height={28}
						className={styles.logoImage}
					/>
					<span className={styles.logoText}>MCP</span>
				</a>
				<nav className={styles.nav}>
					<a
						href="https://github.com/useparagon/paragon-mcp"
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub
					</a>
					<a
						href="https://docs.useparagon.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						Docs
					</a>
				</nav>
			</header>

			<main className={styles.main}>
				<section className={styles.hero}>
					<div className={styles.badge}>Experimental Serverless MCP</div>
					<h1 className={styles.title}>
						Connect AI Agents to
						<span className={styles.highlight}> 130+ Integrations</span>
					</h1>
					<p className={styles.subtitle}>
						Model Context Protocol server that integrates with ActionKit,
						providing prebuilt actions for your users&apos; SaaS applications.
					</p>
					<div className={styles.ctas}>
						<a
							className={styles.primary}
							href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjackmu-paragon%2Fedge-paragon-mcp&env=PROJECT_ID,SIGNING_KEY,MCP_SERVER_URL,NODE_ENV,ENABLE_CUSTOM_OPENAPI_ACTIONS,ENABLE_PROXY_API_TOOL,ENABLE_CUSTOM_TOOL"
							target="_blank"
							rel="noopener noreferrer"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 76 65"
								fill="currentColor"
							>
								<path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
							</svg>
							Deploy to Vercel
						</a>
						<a
							className={styles.secondary}
							href="https://dashboard.useparagon.com/signup"
							target="_blank"
							rel="noopener noreferrer"
						>
							Get Started
						</a>
					</div>
				</section>

				<section className={styles.features}>
					<h2 className={styles.sectionTitle}>Built-in Capabilities</h2>
					<div className={styles.featureGrid}>
						<div className={styles.featureCard}>
							<div className={styles.featureIcon}>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M12 2L2 7l10 5 10-5-10-5z" />
									<path d="M2 17l10 5 10-5" />
									<path d="M2 12l10 5 10-5" />
								</svg>
							</div>
							<h3>ActionKit Integration</h3>
							<p>
								Access prebuilt actions for Google Calendar, Salesforce, Slack,
								and 130+ other integrations.
							</p>
						</div>
						<div className={styles.featureCard}>
							<div className={styles.featureIcon}>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
									<path d="M7 11V7a5 5 0 0 1 10 0v4" />
								</svg>
							</div>
							<h3>Secure OAuth Flows</h3>
							<p>
								Connect Portal handles OAuth 2.0 and API Key intake flows with
								enterprise-grade security.
							</p>
						</div>
						<div className={styles.featureCard}>
							<div className={styles.featureIcon}>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
								</svg>
							</div>
							<h3>Custom Actions</h3>
							<p>
								Extend with OpenAPI specs or enable direct API access through
								the experimental Proxy API.
							</p>
						</div>
					</div>
				</section>

				<section className={styles.integrations}>
					<h2 className={styles.sectionTitle}>Popular Integrations</h2>
					<div className={styles.integrationList}>
						<div className={styles.integrationPill}>Google Calendar</div>
						<div className={styles.integrationPill}>Salesforce</div>
						<div className={styles.integrationPill}>Slack</div>
						<div className={styles.integrationPill}>HubSpot</div>
						<div className={styles.integrationPill}>Notion</div>
						<div className={styles.integrationPill}>Jira</div>
						<div className={styles.integrationPill}>GitHub</div>
						<div className={styles.integrationPill}>Zendesk</div>
						<div className={styles.integrationPill}>+120 more</div>
					</div>
				</section>

				<section className={styles.quickstart}>
					<h2 className={styles.sectionTitle}>Quick Start</h2>
					<div className={styles.codeBlock}>
						<div className={styles.codeHeader}>
							<span>Cursor Configuration</span>
							<span className={styles.codePath}>~/.cursor/mcp.json</span>
						</div>
						<pre className={styles.code}>
							<code>{`{
  "mcpServers": {
    "paragon-mcp": {
      "url": "http://localhost:3001/sse?user=[user-id]"
    }
  }
}`}</code>
						</pre>
					</div>
				</section>

				<section className={styles.endpoints}>
					<h2 className={styles.sectionTitle}>API Endpoints</h2>
					<div className={styles.endpointList}>
						<div className={styles.endpoint}>
							<span className={styles.method}>GET</span>
							<span className={styles.path}>/mcp</span>
							<span className={styles.desc}>
								Streamable HTTP connection for MCP
							</span>
						</div>
						<div className={styles.endpoint}>
							<span className={styles.method}>POST</span>
							<span className={styles.path}>/mcp</span>
							<span className={styles.desc}>MCP message processing</span>
						</div>
						<div className={styles.endpoint}>
							<span className={styles.methodAlt}>GET</span>
							<span className={styles.path}>/setup</span>
							<span className={styles.desc}>Integration setup flow</span>
						</div>
					</div>
				</section>
			</main>

			<footer className={styles.footer}>
				<p>
					Open source under{" "}
					<a
						href="https://opensource.org/license/mit"
						target="_blank"
						rel="noopener noreferrer"
					>
						MIT License
					</a>
				</p>
				<p>
					Built by{" "}
					<a
						href="https://useparagon.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						Paragon
					</a>
				</p>
			</footer>
		</div>
	);
}
