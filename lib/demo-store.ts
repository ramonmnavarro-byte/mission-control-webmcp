import { z } from 'zod'
import type { DemoSnapshot, DemoTask, IncidentAction, IncidentState, Severity, ShieldWallState } from './types'

export const createTaskInputSchema = z.object({
  title:z.string().trim().min(3).max(80).regex(/^[a-zA-Z0-9][a-zA-Z0-9 .,:;!?()/-]*$/,'Plain text only'),
  priority:z.enum(['high','medium','low']), assignee:z.enum(['Orion','Vega','Nova']),
}).strict()
export const incidentActionSchema = z.object({ action:z.enum(['start','contain','resolve','reset']), source:z.enum(['human','webmcp']).default('human') }).strict()

const blockedTerms=['production','customer','client','crm','email','calendar','database','api key','secret','password','token']
const DEMO_CHECKS=[
  {id:'dependency-health',label:'Dependency audit',evidence:'Pinned demo dependencies have a verified zero-vulnerability production audit.',remediation:'Keep the lockfile current and rerun the real local dependency audit before release.'},
  {id:'secret-pattern-guard',label:'Secret exposure guard',evidence:'The demo boundary declares no credentials and the repository privacy gate is clean.',remediation:'Keep environment files excluded and rerun the real local privacy scan before release.'},
  {id:'security-headers',label:'Security headers',evidence:'CSP limits connections to self and blocks objects, framing, cameras, microphones, and location.',remediation:'Preserve the restrictive headers and recheck the production response after deployment.'},
  {id:'input-validation',label:'Input validation',evidence:'Task, scan, and incident inputs use strict allowlist schemas with extra properties rejected.',remediation:'Add a schema and negative tests before exposing any additional demo action.'},
  {id:'integration-isolation',label:'Integration isolation',evidence:'The demo has no API routes, network targets, credentials, analytics, or external integrations.',remediation:'Do not add remote destinations, arbitrary URLs, backend rewrites, or persistent storage.'},
  {id:'webmcp-least-privilege',label:'WebMCP permission boundary',evidence:'Tools are bounded to fictional reads, validated memory writes, local checks, and reversible drill actions.',remediation:'Keep tool schemas strict and require a separate review before broadening any capability.'},
] as const

function createChecks(){return DEMO_CHECKS.map((check)=>({...check,status:'pass' as const,severity:'info' as const}))}
function summarize(checks:ReturnType<typeof createChecks>){return checks.reduce<Record<Severity,number>>((summary,check)=>({...summary,[check.severity]:summary[check.severity]+1}),{critical:0,high:0,medium:0,low:0,info:0})}
const checks=createChecks()
const shieldSeed:ShieldWallState={
  disclaimer:'Demo security checks only — not a professional penetration test and never a scan of real systems.',runNumber:4,
  lastRunAt:'2026-08-26T14:00:00.000Z',nextRunAt:'2026-08-27T14:00:00.000Z',cadence:'simulated-daily',checks,severity:summarize(checks),
  history:[{id:'scan-history-4',ranAt:'2026-08-26T14:00:00.000Z',score:100,findings:0},{id:'scan-history-3',ranAt:'2026-08-25T14:00:00.000Z',score:92,findings:1},{id:'scan-history-2',ranAt:'2026-08-24T14:00:00.000Z',score:83,findings:2}],
}
const seed:DemoSnapshot={
  boundary:{mode:'fictional-demo',persistence:'memory-only',integrations:'disabled'},organization:'Northstar Research Lab',
  fleet:[{id:'atlas',name:'Atlas',role:'Telemetry coordinator',status:'online',cpu:34,memory:52,jobs:6},{id:'kepler',name:'Kepler',role:'Orbit analysis',status:'online',cpu:21,memory:38,jobs:3},{id:'lumen',name:'Lumen',role:'Signal processing',status:'attention',cpu:78,memory:71,jobs:9}],
  tasks:[{id:'task-101',title:'Inspect Lumen thermal trend',priority:'high',assignee:'Orion',status:'in-progress'},{id:'task-102',title:'Validate Kepler pass schedule',priority:'medium',assignee:'Vega',status:'queued'},{id:'task-103',title:'Archive synthetic telemetry batch',priority:'low',assignee:'Nova',status:'queued'}],
  activity:[{id:'event-1',event:'Atlas completed a fictional relay check',time:'2 min ago',tone:'ok'},{id:'event-2',event:'Lumen crossed the demo attention threshold',time:'12 min ago',tone:'warning'},{id:'event-3',event:'Kepler published a synthetic orbit window',time:'28 min ago',tone:'info'}],
  shieldWall:shieldSeed,
  incident:{id:'drill-lumen-signal',title:'Lumen signal anomaly',status:'ready',summary:'A fictional signal burst is ready for a reversible response drill.',audit:[{id:'incident-audit-1',event:'Incident drill ready',at:'2026-08-27T13:30:00.000Z',source:'human',tone:'info'}]},
}

export interface DemoStoreOptions{now?:()=>Date}
export interface DemoStore{getSnapshot():DemoSnapshot;createTask(input:unknown):DemoTask;runSecurityScan():ShieldWallState;advanceIncident(input:unknown):IncidentState;subscribe(listener:()=>void):()=>void}
export function createDemoStore(options:DemoStoreOptions={}):DemoStore{
  let snapshot:DemoSnapshot=structuredClone(seed),taskId=4,auditId=2;const listeners=new Set<()=>void>();const now=options.now??(()=>new Date());const publish=()=>listeners.forEach((listener)=>listener())
  return{
    getSnapshot:()=>snapshot,
    createTask(input){const parsed=createTaskInputSchema.parse(input);if(blockedTerms.some((term)=>parsed.title.toLowerCase().includes(term)))throw new Error('Demo tasks cannot reference external workflows.');const task:DemoTask={id:`demo-task-${taskId++}`,...parsed,status:'queued',ephemeral:true};snapshot={...snapshot,tasks:[task,...snapshot.tasks]};publish();return task},
    runSecurityScan(){const ranAt=now(),newChecks=createChecks(),runNumber=snapshot.shieldWall.runNumber+1;const shieldWall:ShieldWallState={...snapshot.shieldWall,runNumber,lastRunAt:ranAt.toISOString(),nextRunAt:new Date(ranAt.getTime()+86_400_000).toISOString(),checks:newChecks,severity:summarize(newChecks),history:[{id:`scan-history-${runNumber}`,ranAt:ranAt.toISOString(),score:100,findings:0},...snapshot.shieldWall.history].slice(0,7)};snapshot={...snapshot,shieldWall};publish();return shieldWall},
    advanceIncident(input){const{action,source}=incidentActionSchema.parse(input),current=snapshot.incident.status;const expected:Partial<Record<IncidentAction,IncidentState['status']>>={start:'ready',contain:'active',resolve:'contained'};if(action!=='reset'&&current!==expected[action]){const required=action==='contain'?'start':action==='resolve'?'contain':'reset';throw new Error(`Incident action requires ${required} first.`)}const status:IncidentState['status']=action==='start'?'active':action==='contain'?'contained':action==='resolve'?'resolved':'ready';const event=action==='start'?'Fictional signal drill started':action==='contain'?'Fictional signal contained':action==='resolve'?'Demo incident resolved':'Incident drill reset to ready';const tone=action==='start'?'warning' as const:action==='contain'||action==='resolve'?'ok' as const:'info' as const;const summary=status==='ready'?'A fictional signal burst is ready for a reversible response drill.':status==='active'?'The fictional signal is active inside the in-memory simulation.':status==='contained'?'The fictional signal is isolated; no real system was affected.':'The fictional drill is resolved and can be reset.';const incident:IncidentState={...snapshot.incident,status,summary,audit:[{id:`incident-audit-${auditId++}`,event,at:now().toISOString(),source,tone},...snapshot.incident.audit].slice(0,8)};snapshot={...snapshot,incident};publish();return incident},
    subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener)},
  }
}
