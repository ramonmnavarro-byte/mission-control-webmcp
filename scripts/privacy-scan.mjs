import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = process.cwd()
const skip = new Set(['node_modules', '.next', '.git', 'coverage', 'playwright-report', 'test-results'])
const blockedNames = [
  /^\.env(?!\.example$)/i,
  /\.(db|sqlite|sqlite3|log|pem|key|p12)$/i,
  /^(uploads?|exports?|backups?|private)$/i,
]
const patterns = [
  { name: 'absolute user path', pattern: /(?:\/Users\/|\/home\/|[A-Z]:\\Users\\)[^\s'"<>]+/i },
  { name: 'private network address', pattern: /\b(?:10\.(?:\d{1,3}\.){2}\d{1,3}|192\.168\.(?:\d{1,3}\.)\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.(?:\d{1,3}\.)\d{1,3})\b/ },
  { name: 'credential assignment', pattern: /(api[_-]?key|secret|password|token)\s*[:=]\s*['"][^'"]{8,}/i },
  { name: 'private key', pattern: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'analytics identifier', pattern: /\b(G-[A-Z0-9]{8,}|UA-\d+-\d+)\b/ },
]
const files = []

function walk(directory) {
  for (const name of readdirSync(directory)) {
    if (skip.has(name)) continue
    const path = join(directory, name)
    const displayPath = relative(root, path)
    if (blockedNames.some((pattern) => pattern.test(name))) throw new Error(`Blocked file category: ${displayPath}`)
    if (statSync(path).isDirectory()) walk(path)
    else files.push(path)
  }
}

walk(root)
const findings = []
for (const file of files) {
  let text
  try { text = readFileSync(file, 'utf8') } catch { continue }
  for (const check of patterns) if (check.pattern.test(text)) findings.push(`${check.name}: ${relative(root, file)}`)
}
if (findings.length) {
  console.error(findings.join('\n'))
  process.exit(1)
}
console.log(`Privacy scan passed: ${files.length} files checked; no blocked file categories or sensitive patterns found.`)
