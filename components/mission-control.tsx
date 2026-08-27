'use client'
import { useState, type FormEvent } from 'react'
import { Activity, Bot, CheckCircle2, CircleDot, Cpu, Plus, Radio, ShieldCheck, Sparkles } from 'lucide-react'
import { DemoProvider, useDemo } from '@/lib/demo-context'
import type { Priority } from '@/lib/types'
import { ShieldWall } from './shield-wall'
import { EvaluationPanel } from './evaluation-panel'
import { IncidentDrill } from './incident-drill'

const Metric=({label,value,hint}:{label:string;value:string;hint:string})=><div className="metric"><span>{label}</span><strong>{value}</strong><small>{hint}</small></div>
function Dashboard(){
  const{snapshot,createTask,runSecurityScan,advanceIncident,webMcp}=useDemo()
  const[title,setTitle]=useState(''),[priority,setPriority]=useState<Priority>('medium')
  const attention=snapshot.fleet.filter((node)=>node.status==='attention').length,jobs=snapshot.fleet.reduce((sum,node)=>sum+node.jobs,0)
  function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(title.trim().length<3)return;createTask({title:title.trim(),priority,assignee:'Orion'});setTitle('')}
  return <main>
    <header className="topbar"><div className="brand"><div className="brand-mark"><Radio size={18}/></div><div><span>Northstar</span><small>Research Lab</small></div></div><div className="demo-pill"><ShieldCheck size={15}/> Fictional demo · integrations disabled</div><div className="live"><i/>simulation online</div></header>
    <section className="hero"><div><p className="eyebrow">OPERATIONS / SYNTHETIC ENVIRONMENT</p><h1>Mission Control</h1><p className="subhead">A shared command surface where people and agents observe, shield, prove, and respond—entirely inside fictional memory.</p></div><div className={`agent-state ${webMcp?'ready':''}`}><Bot size={18}/><div><strong>{webMcp?'WebMCP ready':'WebMCP preview'}</strong><span>{webMcp?'4 tools registered':'Tools register in a WebMCP-enabled browser'}</span></div></div></section>
    <nav className="story-rail" aria-label="Challenge story"><span><b>01</b>Observe</span><i/><span><b>02</b>Shield</span><i/><span><b>03</b>Prove</span><i/><span><b>04</b>Respond</span></nav>
    <section className="metrics" aria-label="Mission summary"><Metric label="Fleet online" value={`${snapshot.fleet.length-attention}/${snapshot.fleet.length}`} hint="fictional nodes"/><Metric label="Shield score" value={String(snapshot.shieldWall.history[0].score)} hint="demo checks"/><Metric label="Eval suite" value="5/5" hint="safety scenarios"/><Metric label="Agent tools" value="04" hint="least privilege"/></section>
    <div className="grid observe-grid">
      <section className="panel wide"><div className="heading"><div><p className="eyebrow">OBSERVE / SYSTEM MAP</p><h2>Fleet status</h2></div><Activity size={17}/></div><div className="fleet">{snapshot.fleet.map((node)=><article className="node" key={node.id}><div className="nodehead"><Cpu/><div><h3>{node.name}</h3><p>{node.role}</p></div><span className={node.status}>{node.status}</span></div><div className="bar"><label>CPU <b>{node.cpu}%</b></label><i><em style={{width:`${node.cpu}%`}}/></i></div><div className="bar"><label>MEM <b>{node.memory}%</b></label><i><em style={{width:`${node.memory}%`}}/></i></div><footer><CircleDot size={12}/>{node.jobs} active jobs</footer></article>)}</div></section>
      <aside className="panel"><div className="heading"><div><p className="eyebrow">AGENT SURFACE</p><h2>WebMCP tools</h2></div><Sparkles size={17}/></div>{['get_mission_brief','create_demo_task','run_demo_security_scan','advance_demo_incident'].map((name,index)=><div className="tool compact" key={name}><code>{name}</code><b>{index===0?'READ ONLY':'DEMO WRITE'}</b></div>)}<div className="boundary"><ShieldCheck/><span><strong>Hard demo boundary</strong>No backend, analytics, database, email, calendar, CRM, cloud, or credentials.</span></div></aside>
      <section className="panel wide"><div className="heading"><div><p className="eyebrow">OBSERVE / SHARED WORKSPACE</p><h2>Priority queue</h2></div><span>{snapshot.tasks.length} tasks · {jobs} jobs</span></div><form className="taskform" onSubmit={submit}><input aria-label="Task title" value={title} onChange={(event)=>setTitle(event.target.value)} minLength={3} maxLength={80} placeholder="Add a fictional task…"/><select aria-label="Priority" value={priority} onChange={(event)=>setPriority(event.target.value as Priority)}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select><button><Plus size={15}/>Add demo task</button></form>{snapshot.tasks.map((task)=><article className="task" key={task.id}><i className={task.priority}/><div><h3>{task.title}</h3><p>{task.assignee} · {task.status} {task.ephemeral&&'· session only'}</p></div><span>{task.priority}</span></article>)}</section>
      <aside className="panel"><div className="heading"><div><p className="eyebrow">OBSERVE / AUDIT TRAIL</p><h2>Recent activity</h2></div><CheckCircle2 size={17}/></div>{snapshot.activity.map((entry)=><div className="event" key={entry.id}><i className={entry.tone}/><div><p>{entry.event}</p><small>{entry.time}</small></div></div>)}</aside>
    </div>
    <div className="story-grid"><ShieldWall shield={snapshot.shieldWall} onRun={runSecurityScan}/><EvaluationPanel/><IncidentDrill incident={snapshot.incident} onAction={advanceIncident}/></div>
    <footer className="pagefoot"><span>PUBLIC-SAFE DEMO BUILD · OBSERVE → SHIELD → PROVE → RESPOND</span><span>All organizations, operators, systems, tasks, checks, and incidents are fictional.</span></footer>
  </main>
}
export function MissionControl(){return <DemoProvider><Dashboard/></DemoProvider>}
