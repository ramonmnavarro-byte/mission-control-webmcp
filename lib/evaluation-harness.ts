import { createDemoStore } from './demo-store'
import { buildMissionControlTools } from './webmcp'

export interface EvaluationScenario{readonly id:string;readonly label:string;readonly passed:boolean;readonly guarantee:string;readonly detail:string}
export interface EvaluationReport{readonly total:number;readonly passed:number;readonly failed:number;readonly scenarios:readonly EvaluationScenario[]}

async function rejects(action:()=>Promise<unknown>){try{await action();return false}catch{return true}}
export async function runWebMcpEvaluation():Promise<EvaluationReport>{
  const scenarios:EvaluationScenario[]=[]
  const readStore=createDemoStore(),readTools=Object.fromEntries(buildMissionControlTools(readStore).map((tool)=>[tool.name,tool]))
  const read=await readTools.get_mission_brief.execute({priority:'high'});scenarios.push({id:'valid-read',label:'Bounded priority brief',passed:read.content[0].text.includes('Northstar Research Lab')&&!read.content[0].text.includes('Archive synthetic telemetry batch'),guarantee:'Bounded fictional read',detail:'Returns only matching demo tasks.'})
  const writeStore=createDemoStore(),writeTools=Object.fromEntries(buildMissionControlTools(writeStore).map((tool)=>[tool.name,tool]));await writeTools.create_demo_task.execute({title:'Evaluate fictional relay handoff',priority:'medium',assignee:'Vega'});scenarios.push({id:'valid-write',label:'Ephemeral task write',passed:writeStore.getSnapshot().tasks.length===4,guarantee:'Memory-only mutation',detail:'Changes only the isolated scenario store.'})
  const invalid=await rejects(()=>writeTools.create_demo_task.execute({title:'<script>',priority:'high',assignee:'Orion'}));scenarios.push({id:'invalid-input',label:'Markup rejection',passed:invalid,guarantee:'Strict schema rejection',detail:'Markup and invalid shapes are rejected.'})
  const forbidden=await rejects(()=>writeTools.create_demo_task.execute({title:'Connect production CRM',priority:'high',assignee:'Orion'}));scenarios.push({id:'forbidden-action',label:'External workflow rejection',passed:forbidden,guarantee:'External workflow isolation',detail:'Production and integration terms are blocked.'})
  const freshStore=createDemoStore();scenarios.push({id:'state-reset',label:'Fresh-store isolation',passed:freshStore.getSnapshot().tasks.length===3&&writeStore.getSnapshot().tasks.length===4,guarantee:'State reset isolation',detail:'Every evaluation store starts from clean fictional seed data.'})
  const passed=scenarios.filter((scenario)=>scenario.passed).length
  return{total:scenarios.length,passed,failed:scenarios.length-passed,scenarios}
}
