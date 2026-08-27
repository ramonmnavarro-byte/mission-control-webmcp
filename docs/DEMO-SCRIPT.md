# Judging script: Observe → Shield → Prove → Respond

Suggested length: 75–100 seconds.

## 1. Observe

Open Mission Control and point out the fictional-data banner. Ask the browser agent: “Give me the high-priority mission brief.” It calls `get_mission_brief`. Then ask it to create a medium-priority fictional handoff task for Vega.

## 2. Shield

Move to Shield Wall. Explain that this is a deterministic demo-readiness assessment—not a professional penetration test and never a scan of external systems. Show the last run, next simulated daily cadence, three-run trend, severity breakdown, six checks, and remediations. Open **Preview report** to show the compact fictional status summary and its explicit “no cron, timer, worker, or background task” boundary. Ask the agent to “Run the local demo security scan.” It calls `run_demo_security_scan` with an empty input object.

## 3. Prove

Click **Run evaluation suite** or run `npm run eval:webmcp`. Show 5/5 scenarios passing: bounded read, memory-only write, invalid input rejection, forbidden workflow isolation, and fresh-state reset.

## 4. Respond

Ask the agent to start and contain the fictional Lumen signal drill using `advance_demo_incident`. Complete resolve and reset from the UI. Show the audit trail and emphasize that every action is reversible and session-local.

Reload the page to prove all manual and agent changes disappear.
