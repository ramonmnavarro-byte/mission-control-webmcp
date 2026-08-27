import type { ShieldWallState } from './types'

const reportTime=(iso:string)=>iso.replace('T',' ').slice(0,16)+' UTC'
export interface ScheduledReport{
  readonly schedule:string
  readonly status:string
  readonly lastReport:string
  readonly nextWindow:string
  readonly summary:string
  readonly severities:string
  readonly remediations:string
  readonly automation:string
  readonly jobs:readonly {readonly source:'STUDIO';readonly name:string;readonly status:'ok'|'review';readonly last:string;readonly next:string}[]
}

export function formatScheduledReport(shield:ShieldWallState):ScheduledReport{
  const passed=shield.checks.filter((check)=>check.status==='pass').length
  const findings=shield.history[0].findings
  const last=reportTime(shield.lastRunAt),next=reportTime(shield.nextRunAt)
  return{
    schedule:'Simulated daily · manual or WebMCP trigger only',
    status:`${findings===0?'Ready':'Attention'} · ${passed}/${shield.checks.length} demo checks passed`,
    lastReport:`Report #${shield.runNumber} · ${reportTime(shield.lastRunAt)} · score ${shield.history[0].score}`,
    nextWindow:`Window ${reportTime(shield.nextRunAt)}`,
    summary:`${shield.checks.length} checks · ${findings} actionable findings · ${shield.severity.info} informational assurances`,
    severities:`Critical ${shield.severity.critical} · High ${shield.severity.high} · Medium ${shield.severity.medium} · Low ${shield.severity.low} · Info ${shield.severity.info}`,
    remediations:`${shield.checks.filter((check)=>check.remediation.length>0).length} preventive remediations documented`,
    automation:'None — no cron, timer, worker, or background task',
    jobs:[
      {source:'STUDIO',name:'Vulnerability readiness report',status:'ok',last,next},
      {source:'STUDIO',name:'Secret guard digest',status:'ok',last,next},
      {source:'STUDIO',name:'Header assurance summary',status:'ok',last,next},
      {source:'STUDIO',name:'Remediation follow-up',status:'review',last,next},
    ],
  }
}
