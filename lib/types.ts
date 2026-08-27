export type Priority = 'high' | 'medium' | 'low'
export type DemoAssignee = 'Orion' | 'Vega' | 'Nova'
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'

export interface DemoTask { readonly id:string; readonly title:string; readonly priority:Priority; readonly assignee:DemoAssignee; readonly status:'queued'|'in-progress'; readonly ephemeral?:boolean }
export interface SecurityCheck { readonly id:string; readonly label:string; readonly status:'pass'|'attention'; readonly severity:Severity; readonly evidence:string; readonly remediation:string }
export interface ScanHistoryEntry { readonly id:string; readonly ranAt:string; readonly score:number; readonly findings:number }
export interface ShieldWallState { readonly disclaimer:string; readonly runNumber:number; readonly lastRunAt:string; readonly nextRunAt:string; readonly cadence:'simulated-daily'; readonly checks:readonly SecurityCheck[]; readonly severity:Readonly<Record<Severity,number>>; readonly history:readonly ScanHistoryEntry[] }
export type IncidentStatus = 'ready'|'active'|'contained'|'resolved'
export type IncidentAction = 'start'|'contain'|'resolve'|'reset'
export interface IncidentState { readonly id:'drill-lumen-signal'; readonly title:'Lumen signal anomaly'; readonly status:IncidentStatus; readonly summary:string; readonly audit:readonly { readonly id:string; readonly event:string; readonly at:string; readonly source:'human'|'webmcp'; readonly tone:'info'|'warning'|'ok' }[] }
export interface DemoSnapshot {
  readonly boundary:{ readonly mode:'fictional-demo'; readonly persistence:'memory-only'; readonly integrations:'disabled' }
  readonly organization:'Northstar Research Lab'
  readonly fleet:readonly { readonly id:string; readonly name:string; readonly role:string; readonly status:'online'|'attention'; readonly cpu:number; readonly memory:number; readonly jobs:number }[]
  readonly tasks:readonly DemoTask[]
  readonly activity:readonly { readonly id:string; readonly event:string; readonly time:string; readonly tone:'ok'|'info'|'warning' }[]
  readonly shieldWall:ShieldWallState
  readonly incident:IncidentState
}
