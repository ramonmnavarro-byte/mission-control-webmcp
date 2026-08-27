import { runWebMcpEvaluation } from '../lib/evaluation-harness'

async function main(){
  const report=await runWebMcpEvaluation()
  for(const scenario of report.scenarios)console.log(`${scenario.passed?'PASS':'FAIL'} ${scenario.id}: ${scenario.guarantee}`)
  console.log(`WebMCP demo evaluation: ${report.passed}/${report.total} passed`)
  if(report.failed>0)process.exitCode=1
}

void main()
