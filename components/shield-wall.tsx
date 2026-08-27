'use client'
import { useState } from 'react'
import { CheckCircle2, FileText, Play, ShieldCheck } from 'lucide-react'
import type { ShieldWallState } from '@/lib/types'
import { formatScheduledReport } from '@/lib/scheduled-report'

const shortTime=(iso:string)=>iso.replace('T',' ').slice(0,16)+' UTC'
export function ShieldWall({shield,onRun}:{shield:ShieldWallState;onRun:()=>void}){
  const[message,setMessage]=useState(''),[preview,setPreview]=useState(false)
  const report=formatScheduledReport(shield)
  function run(){const next=shield.runNumber+1;onRun();setMessage(`Scan #${next} complete · 6/6 checks passed`)}
  return <section className="panel story-panel shield-panel" aria-labelledby="shield-wall-title">
    <div className="heading"><div><p className="eyebrow">SHIELD / DAILY VULNERABILITY SCAN</p><h2 id="shield-wall-title">Shield Wall</h2></div><div className="score-ring"><strong>{shield.history[0].score}</strong><span>posture</span></div></div>
    <p className="disclaimer"><ShieldCheck size={15}/>{shield.disclaimer}</p>
    <div className="scan-meta"><div><span>Last run</span><b>{shortTime(shield.lastRunAt)}</b></div><div><span>Next simulated run</span><b>{shortTime(shield.nextRunAt)}</b></div><button onClick={run}><Play size={14}/>Run demo scan</button></div>
    {message&&<p className="scan-message" role="status">{message}</p>}
    <div className="shield-summary"><div><b>6/6</b><span>checks passed</span></div><div><b>0</b><span>open findings</span></div><div><b>+17</b><span>3-run trend</span></div><div><b>24h</b><span>manual cadence</span></div></div>
    <div className="scheduled-report"><div><FileText size={16}/><span><b>Simulated scheduled report</b><small>{report.schedule} · {report.status}</small></span></div><button aria-expanded={preview} onClick={()=>setPreview((value)=>!value)}>{preview?'Hide report':'Preview report'}</button></div>
    {preview&&<section className="report-preview" aria-label="Scheduled report preview"><header><span>DEMO SCHEDULED REPORTS</span><em>simulated · all local</em></header><div className="report-stat"><span>Last report status</span><b>{report.lastReport}</b></div><div className="report-stat"><span>Next report window</span><b>{report.nextWindow}</b></div><div className="report-jobs">{report.jobs.map((job)=><article key={job.name}><span>{job.source}</span><b>{job.name}</b><em className={job.status}>{job.status}</em><small>last {job.last}</small><small>next {job.next}</small></article>)}</div><p>{report.summary} · {report.severities}</p><p>{report.remediations}</p><small>{report.automation}. The amber review row is intentional fictional demo status.</small></section>}
    <div className="severity-row"><span className="sev-critical">Critical {shield.severity.critical}</span><span>High {shield.severity.high}</span><span>Medium {shield.severity.medium}</span><span>Low {shield.severity.low}</span><span className="sev-info">Info {shield.severity.info}</span></div>
    <div className="scan-history" aria-label="Security scan trend">{[...shield.history].reverse().map((entry)=><div key={entry.id}><i style={{height:`${Math.max(20,entry.score)}%`}}/><span>{entry.score}</span></div>)}</div>
    <div className="check-grid">{shield.checks.map((check)=><details key={check.id} className="security-check"><summary><CheckCircle2 size={15}/><span><b>{check.label}</b><small>{check.evidence}</small></span><em>{check.status}</em></summary><p><strong>Remediation:</strong> {check.remediation}</p></details>)}</div>
  </section>
}
