# Mission Control WebMCP Demo

A public-safe, fictional operations dashboard showing a person and an agent working through one crisp loop:

**Observe → Shield → Prove → Respond**

**Live demo:** https://mission-control-webmcp-safe-preview.vercel.app/

- **Observe:** inspect a fictional fleet and shared task queue.
- **Shield:** run six deterministic demo security checks, including a simulated Daily Vulnerability Scan and compact scheduled-report preview.
- **Prove:** execute five repeatable WebMCP safety scenarios against fresh isolated stores.
- **Respond:** contain, resolve, and reset a fictional signal incident through reversible in-memory actions.

This is a fresh implementation inspired by a private Mission Control interaction pattern. It contains no private records, backend rewrites, production integrations, analytics, credentials, or copied repository history.

## Run locally

```bash
npm install
npm run dev
```

No environment variables are required. All visible changes reset on reload.

The app includes no tracking or analytics SDK, and the local Next.js CLI scripts explicitly set `NEXT_TELEMETRY_DISABLED=1`.

## WebMCP tools

- `get_mission_brief`: bounded read of fictional fleet and tasks.
- `create_demo_task`: validated, ephemeral task creation.
- `run_demo_security_scan`: runs only six local deterministic demo checks; accepts no target, URL, host, or path.
- `advance_demo_incident`: advances or resets one fictional incident using a strict action enum.

Tools use the official experimental `document.modelContext.registerTool()` pattern. Browsers without WebMCP retain the complete human UI.

## Repeatable evaluation harness

```bash
npm run eval:webmcp
```

The command exercises valid reads, valid writes, invalid input, forbidden external-workflow requests, and fresh-state isolation. Each scenario receives a new in-memory store.

Shield Wall’s “simulated scheduled report” formats the existing in-memory scan snapshot. It does not create a cron job, timer, worker, automation, network request, or persistent record.

## Verification

```bash
npm test
npm run test:coverage
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run scan:privacy
npm audit --omit=dev
```

See [Privacy and architecture](docs/PRIVACY-AND-ARCHITECTURE.md), the [judging script](docs/DEMO-SCRIPT.md), and the [release manifest](RELEASE-MANIFEST.md). References: [WebMCP proposal](https://github.com/webmachinelearning/webmcp) and [OpenAI WebMCP Challenge](https://openai.com/webmcp-challenge/).

## License

MIT — see [LICENSE](LICENSE).
