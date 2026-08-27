'use client'
import { RotateCcw, Siren } from 'lucide-react'
import type { IncidentAction, IncidentState } from '@/lib/types'

export function IncidentDrill({incident,onAction}:{incident:IncidentState;onAction:(action:IncidentAction)=>void}){
  return <section className="panel story-panel incident-panel" aria-labelledby="incident-title">
    <div className="heading"><div><p className="eyebrow">RESPOND / REVERSIBLE PLAYBOOK</p><h2 id="incident-title">Incident Drill</h2></div><span className={`incident-status ${incident.status}`}>{incident.status}</span></div>
    <div className="incident-hero"><Siren size={24}/><div><h3>{incident.title}</h3><p>{incident.summary}</p></div></div>
    <div className="incident-steps"><button disabled={incident.status!=='ready'} onClick={()=>onAction('start')}>Start simulation</button><button disabled={incident.status!=='active'} onClick={()=>onAction('contain')}>Contain simulation</button><button disabled={incident.status!=='contained'} onClick={()=>onAction('resolve')}>Resolve drill</button><button className="reset" onClick={()=>onAction('reset')}><RotateCcw size={13}/>Reset</button></div>
    <div className="incident-audit">{incident.audit.slice(0,4).map((entry)=><div key={entry.id}><i className={entry.tone}/><span><b>{entry.event}</b><small>{entry.source} · {entry.at.replace('T',' ').slice(0,16)} UTC</small></span></div>)}</div>
    <p className="eval-note">Simulation only. Actions are reversible, session-local, and never reach a real device or service.</p>
  </section>
}
