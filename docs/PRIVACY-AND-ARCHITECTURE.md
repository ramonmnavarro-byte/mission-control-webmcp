# Privacy and architecture

## Hard boundary

Everything shown belongs to fictional **Northstar Research Lab**. State is seeded in source, lives only in browser memory, and resets on reload.

The app has no API routes, server actions, environment-variable reads, authentication, cookies, uploads, runtime logs, analytics, remote scripts, databases, email, calendar, CRM, cloud connection, host discovery, URL input, shell execution, or file access. Its CSP limits connections to the same origin.

## Observe → Shield → Prove → Respond

The React UI and four WebMCP tools share one in-memory store. Agent actions therefore appear in the same visible workspace without granting broader access than the human demo provides.

### Shield Wall and Daily Vulnerability Scan

Shield Wall runs six deterministic checks against declared demo configuration and state:

1. dependency audit evidence;
2. secret-pattern guard evidence;
3. security header configuration;
4. strict input validation;
5. integration isolation;
6. WebMCP least-privilege boundaries.

These are explicitly **demo security checks, not a professional penetration test**. The “daily” schedule is a displayed in-memory cadence only. There is no timer, automation, cron, network scanner, external target, or background job. A manual or WebMCP run updates only the local timestamp, next simulated run, bounded history, and derived score.

The real repository gates remain separate commands: `npm audit --omit=dev` and `npm run scan:privacy`.

### Evaluation harness

`npm run eval:webmcp` calls the same tool implementations used by the page. Five scenarios each create a fresh store, preventing cross-scenario and visible-session mutation. Failures are recorded as scenario results without exposing internal configuration or credentials.

### Incident drill

The Lumen signal drill follows `ready → active → contained → resolved`, plus a reversible reset. Invalid and out-of-order actions fail without mutation. The audit trail is capped and memory-only.

## Excluded source categories

Private API rewrites, status/action/chat routes, raw logs, approval bridges, configs, backup scripts, databases, uploads, exports, environment files, analytics identifiers, private URLs, credentials, build output, and private Git history were not imported.
