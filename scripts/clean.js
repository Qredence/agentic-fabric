const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

function rmrf(p) {
  return new Promise((resolve) => {
    if (!fs.existsSync(p)) return resolve();
    fs.rm(p, { recursive: true, force: true }, () => resolve());
  });
}

async function removeDsStore(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await removeDsStore(full);
    else if (e.isFile() && e.name === ".DS_Store") fs.rmSync(full, { force: true });
  }
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function main() {
  try {
    const root = process.cwd();
    const targets = [".next", "out", "build", "coverage", "logs"];
    for (const t of targets) {
      await rmrf(path.join(root, t));
      log(`Removed ${t}`);
    }
    await removeDsStore(root);
    log("Removed .DS_Store files");
    try {
      await run("pnpm", ["store", "prune"]);
      log("Pruned pnpm store");
    } catch (e) {
      log(`pnpm store prune skipped: ${e.message}`);
    }
    process.exit(0);
  } catch (err) {
    process.stderr.write(`clean failed: ${err.message}\n`);
    process.exit(1);
  }
}

main();
