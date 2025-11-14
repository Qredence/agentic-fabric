const fs = require("fs");
const path = require("path");

const aiElements = [
  "artifact","canvas","chain-of-thought","checkpoint","code-block","confirmation","connection","context","controls","conversation","edge","image","inline-citation","loader","message","model-selector","node","open-in-chat","panel","plan","prompt-input","queue","reasoning","shimmer","sources","suggestion","task","tool","toolbar","web-preview"
];

function renderReadme() {
  const lines = [];
  lines.push("# AI Workflow Project");
  lines.push("");
  lines.push("## Setup");
  lines.push("- Requirements: Node >= 18.18, pnpm >= 9");
  lines.push("- Install: `pnpm setup`");
  lines.push("- Env check: `pnpm env:check` (.env.local recommended)");
  lines.push("");
  lines.push("## Clean");
  lines.push("- Remove artifacts and caches: `pnpm clean`");
  lines.push("- Reset deps: `pnpm clean:deps` then `pnpm setup`");
  lines.push("- Remove logs: `pnpm clean:logs`");
  lines.push("");
  lines.push("## Optimize");
  lines.push("- Lint fix: `pnpm lint:fix`");
  lines.push("- Format: `pnpm format`");
  lines.push("- Typecheck: `pnpm typecheck`");
  lines.push("- Find unused deps: `pnpm deps:unused`");
  lines.push("");
  lines.push("## Build");
  lines.push("- Verify: `pnpm verify` (lint + typecheck + tests)");
  lines.push("- Build: `pnpm build` | CI: `pnpm build:ci`");
  lines.push("- Start production: `pnpm start:prod`");
  lines.push("");
  lines.push("## React Flow");
  lines.push("- Install: `npm install @xyflow/react`");
  lines.push("- Import stylesheet before shadcn UI CSS: `import '@xyflow/react/dist/style.css'`");
  lines.push("- Docs: https://reactflow.dev/learn and https://reactflow.dev/ui");
  lines.push("");
  lines.push("## AI Elements");
  lines.push("- Available components:");
  lines.push(aiElements.map((n) => `  - ${n}`).join("\n"));
  lines.push("");
  lines.push("## Testing");
  lines.push("- Vitest: `pnpm test` | `pnpm test:run` | UI: `pnpm test:ui`");
  lines.push("");
  lines.push("## Notes");
  lines.push("- Caching headers configured in Next for static and dynamic content");
  return lines.join("\n");
}

function main() {
  const readmePath = path.join(process.cwd(), "README.md");
  const content = renderReadme();
  fs.writeFileSync(readmePath, content, "utf8");
  process.stdout.write("README.md generated\n");
}

main();
