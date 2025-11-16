const fs = require('fs');
const path = require('path');
const { z } = require('zod');

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const vars = {};
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key) vars[key] = val;
  }
  return vars;
}

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

function fail(msg) {
  process.stderr.write(`${msg}\n`);
  process.exit(1);
}

async function main() {
  try {
    const root = process.cwd();
    const envLocal = path.join(root, '.env.local');
    const envDefault = path.join(root, '.env');
    const envVars = readEnvFile(fs.existsSync(envLocal) ? envLocal : envDefault);

    log(`Node: ${process.version}`);
    log(
      `PNPM: ${process.env.npm_execpath && process.env.npm_execpath.includes('pnpm') ? 'pnpm' : 'unknown'}`,
    );

    const EnvSchema = z.object({
      NEXT_PUBLIC_APP_NAME: z.string().min(1),
    });
    const merged = { ...envVars, ...process.env };
    const parsed = EnvSchema.safeParse(merged);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      fail(`Missing/invalid env: ${issues}. Create .env.local and re-run.`);
    }

    log('Environment variables OK');
    process.exit(0);
  } catch (err) {
    fail(`env:check failed: ${err && err.message ? err.message : String(err)}`);
  }
}

main();
