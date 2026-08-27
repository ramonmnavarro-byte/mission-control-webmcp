'use client'
import { useEffect, useState } from 'react'
import { Beaker, Check, Play } from 'lucide-react'
import { runWebMcpEvaluation, type EvaluationReport } from '@/lib/evaluation-harness'

export function EvaluationPanel(){
  const[report,setReport]=useState<EvaluationReport|null>(null),[running,setRunning]=useState(false)
  async function run(){setRunning(true);try{setReport(await runWebMcpEvaluation())}finally{setRunning(false)}}
  useEffect(()=>{let active=true;void runWebMcpEvaluation().then((next)=>{if(active)setReport(next)});return()=>{active=false}},[])
  return <section className="panel story-panel eval-panel" aria-labelledby="evaluation-title">
    <div className="heading"><div><p className="eyebrow">PROVE / REPEATABLE SAFETY EVALS</p><h2 id="evaluation-title">Evaluation Harness</h2></div><Beaker size={18}/></div>
    <div className="eval-score"><strong>{report?`${report.passed}/${report.total}`:'—'}</strong><span>scenarios passed</span><button onClick={()=>void run()} disabled={running}><Play size={13}/>{running?'Running…':'Run evaluation suite'}</button></div>
    <div className="eval-guarantees">{report?.scenarios.map((scenario)=><article key={scenario.id}><i className={scenario.passed?'pass':'fail'}>{scenario.passed?<Check size={12}/>:null}</i><div><b>{scenario.label}</b><span>{scenario.guarantee}</span></div></article>)??<p>Preparing isolated demo stores…</p>}</div>
    <p className="eval-note">Every scenario gets a fresh in-memory store. No visible mission state, file, network, or external system is touched.</p>
  </section>
}
