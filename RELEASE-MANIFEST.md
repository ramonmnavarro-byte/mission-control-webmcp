# Release manifest

## Included in the public-safe source package

- `app/` — Next.js page, security-focused styles, and metadata.
- `components/` — fictional Mission Control, Shield Wall, evaluation, incident, and scheduled-report UI.
- `lib/` — in-memory demo store, strict WebMCP tools, deterministic checks, evaluation logic, and report formatter.
- `tests/` — unit, integration, UI, desktop E2E, and mobile no-overflow coverage.
- `scripts/` — local privacy scan and repeatable WebMCP evaluation command.
- `docs/` — architecture/privacy notes and judging walkthrough.
- Project configuration, lockfile, `.env.example`, `.gitignore`, README, Vercel framework hint, and MIT license.

## Explicitly excluded

Private Mission Control source/history, production routes, environment files, credentials, logs, databases, uploads, exports, backups, analytics identifiers, customer/business data, build output, editor metadata, local agent instructions, and local deployment state.

## Public-safe claims supported by the release gate

- All visible organizations, operators, systems, tasks, schedules, checks, reports, and incidents are fictional.
- Runtime state is browser-memory only and resets on reload.
- The application has no API routes, server actions, authentication, cookies, browser persistence, analytics/tracking SDKs, tracking pixels, external runtime calls, arbitrary URLs/hosts/paths, shell execution, file access, or production integrations.
- Four WebMCP tools are limited to bounded fictional reads, validated task creation, deterministic local demo checks, and reversible incident actions.
- “Daily” scan/report scheduling is simulated display state only; no cron, timer, automation, worker, or background job runs.
- Shield Wall is a deterministic demo-readiness assessment, not a professional penetration test and never a scan of real systems.
- Next CLI telemetry is disabled in development, build, and start scripts.

## Verification snapshot

- 21 unit/integration/UI tests and 2 desktop/mobile E2E tests passed.
- Covered logic: 100% statements, functions, and lines; 95.71% branches.
- WebMCP evaluation harness: 5/5 scenarios passed.
- Typecheck, lint, production build, privacy scan, and production dependency audit passed; dependency audit reported zero vulnerabilities.
- Browser release audit observed only same-origin GET requests and zero external requests, cookies, storage, service workers, external resources, tracking pixels, or leak matches.
- Client/static and served application assets contained no private paths, private network addresses, credentials, trackers, or client source maps.

## Residual platform notes

- The CSP permits inline framework hydration code while restricting scripts, resources, and connections to the same origin. The application renders no raw user HTML.
- Local `.next` server metadata can contain local build paths. `.next` is ignored, excluded from this source package, and rebuilt by the eventual hosting environment; client assets and served responses were clean.
