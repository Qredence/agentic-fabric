# Agents

A practical guide to how agents are defined, configured, and used inside this project—both in the runtime and in the workflow‑builder UI.

If you are building, wiring, or debugging agents (or Magentic workflows), start here.

## Big Picture

- Agents share a common protocol and type system so they can run, stream, and use tools in a consistent way.
- Workflows embed agents via _executors_, which act as the bridge between the visual canvas and the runtime.
- Tools are first‑class: they are typed, labeled for the UI, and can be protocol‑based, AI‑function based, or hosted/MCP variants.

Key implementation references:

- Core protocol and types:
  - `AgentProtocol` and run/stream signatures: `lib/workflow/agent.ts:8-16`
  - Common run options (`AgentRunOptions`): `lib/workflow/agent.ts:21-30`
- Workflow embedding via executors:
  - Core `Executor` interface: `lib/workflow/executors.ts:21-25`
  - `AgentExecutor` fields: `lib/workflow/executors.ts:90-100`
  - Magentic orchestrator executor: `lib/workflow/executors.ts:145-150`
- Tool integration types and labels:
  - Tool definitions: `lib/workflow/tools.ts:1-22`
  - UI labels via `getToolTypeLabel`: `lib/workflow/tools.ts:225-242`

## Agent Types & When to Use Them

There are two primary agent flavors:

- `ChatAgent`
  - Designed for LLM chat clients and tool use.
  - Ideal for conversational tasks that may call tools (search, code, http, etc.).
  - Implementation details: `lib/workflow/agent.ts:139-148`
- `WorkflowAgent`
  - Wraps a workflow so it can be addressed as a single “agent”.
  - Ideal when you want to expose a multi‑step orchestration or sub‑workflow behind a single interface.
  - Implementation details: `lib/workflow/agent.ts:227-232`

Rule of thumb:

- Use **Chat agents** for direct user conversations with optional tools.
- Use **Workflow agents** when you want an agent to _run a workflow_ (Magentic, pipelines, or other orchestrations) behind the scenes.

## Configuring Agents

At the protocol level, agents accept `AgentRunOptions`, which control:

- System prompt
- Tools and tool mode
- Model and model parameters (temperature, `maxTokens`)
- Streaming behavior
- Metadata for observability/tracing

See `lib/workflow/agent.ts:21-30` for the exact shape of `AgentRunOptions`.

In the workflow‑builder UI, agents are configured via `AgentExecutor` nodes:

- Editor data maps to the `AgentExecutor` interface: `lib/workflow/executors.ts:90-100`
- Common fields:
  - `agentId`
  - `agentType` (`chat | workflow | magentic`)
  - `model`, `systemPrompt`, `temperature`, `maxTokens`
  - `toolMode`, `tools[]`

This makes it easy to go from a visual configuration to a runtime‑ready agent without writing glue code.

## Magentic Workflow Support

Magentic workflows provide higher‑level orchestration over agents and tools.

- Default wiring is handled by `createExecutorFromNodeType` with Magentic metadata: `lib/workflow/conversion.ts:504-596`
- Canvas ↔ runtime conversions preserve metadata so editors can be rehydrated:
  - React Flow → Workflow: `lib/workflow/conversion.ts:73-168`
  - Workflow → React Flow: `lib/workflow/conversion.ts:173-232`

Practically, this means:

- You can design a Magentic flow visually.
- The runtime receives a strongly‑typed workflow representation.
- You can round‑trip workflows (from code → canvas → code) without losing configuration.

## Built‑in Magentic Agent Presets

To speed up common roles, the project ships with opinionated Magentic agent presets in `lib/workflow/magentic-presets.ts:19-62`.

Selecting a preset in the UI auto‑populates:

- Label and description
- Agent role and capabilities
- System prompt
- Default tools

The `MAGENTIC_AGENT_PRESET_MAP` is used for lookup and wiring.

Available presets:

| Key     | Label            | Role       | Core Duties                                              | Default Tools                                      |
| ------- | ---------------- | ---------- | -------------------------------------------------------- | -------------------------------------------------- |
| planner | Planner Agent    | planner    | Break work into steps; maintain fact/progress ledgers    | `magentic-task-ledger`, `magentic-progress-ledger` |
| web     | Web Surfer Agent | web-surfer | Search and summarise authoritative sources               | `web-browser`, `http-client`                       |
| coder   | Coder Agent      | coder      | Generate and run code to fulfil subtasks                 | `hosted-code-interpreter`                          |
| critic  | Critic Agent     | critic     | Review outputs for accuracy, completeness, and adherence | `analysis-notes`                                   |

## Editing Agents in the UI

The workflow‑builder includes dedicated editors for different agent types:

- **Magentic Agent editor**
  - Preset selection and custom overrides.
  - Preset handling and metadata merge: `components/workflow-builder/executor-editors/magentic-agent-executor-editor.tsx:69-107`
  - Editable fields (role, capabilities, tools, system prompt): `components/workflow-builder/executor-editors/magentic-agent-executor-editor.tsx:143-211`
- **Magentic Orchestrator editor**
  - Configure planning strategy, progress tracking, and human‑in‑the‑loop options.
  - Implementation: `components/workflow-builder/executor-editors/magentic-orchestrator-executor-editor.tsx:75-140`
- **Generic Agent editor**
  - For non‑Magentic agents or lower‑level use cases.
  - Implementation: `components/workflow-builder/executor-editors/agent-executor-editor.tsx:39-130`

In the canvas:

- Drag “Magentic Orchestrator” and “Magentic Agent” from the Node Library: `components/workflow-builder/node-library.tsx`
- Select a node to edit its configuration in the right‑hand panel.

## Tool Integration

Tools are how agents interact with the outside world.

- Tool types and shapes: `lib/workflow/tools.ts:160-186`
- UI labels and grouping: `lib/workflow/tools.ts:225-242`

Supported tool styles include:

- Protocol‑based tools (e.g., HTTP, web browsing)
- AI function tools
- Hosted or MCP‑backed tools

These all share a consistent labeling and configuration surface so they feel uniform in the UI and runtime.

## Usage Examples

### AgentExecutor in a Workflow

```json
{
  "id": "agent-1",
  "type": "agent-executor",
  "label": "Agent",
  "description": "Use an AI agent to process messages",
  "agentId": "my-agent",
  "agentType": "chat",
  "model": "gpt-4",
  "systemPrompt": "You are a helpful assistant.",
  "temperature": 0.7,
  "maxTokens": 1000,
  "toolMode": "auto",
  "tools": [{ "toolId": "hosted-code-interpreter", "enabled": true }]
}
```

### Create a Magentic Orchestrator and Agent Programmatically

```ts
import { createExecutorFromNodeType } from '@/lib/workflow/conversion';

const orchestrator = createExecutorFromNodeType(
  'magentic-orchestrator-executor',
  'orch-1',
  'Magentic Orchestrator',
);

const coderAgent = createExecutorFromNodeType('magentic-agent-executor', 'agent-coder', 'Coder', {
  presetKey: 'coder',
});
```

### Editing via UI

- Drag the relevant nodes (e.g., Magentic Orchestrator, Magentic Agent) into the canvas.
- Configure their prompts, models, tools, and roles via the side panel.

## Validation & Testing

Before relying on a new agent configuration, run the test suite:

- Focused conversion tests or the full suite:
  - `pnpm test`
  - `pnpm test -- conversion`
- General verification of the whole project:
  - `pnpm verify`
  - `pnpm build:ci`

These commands help ensure that workflow → runtime conversions, executor metadata, and agent integrations remain stable.

## Extending Presets

To add a new Magentic agent preset:

1. Add a new entry to `MAGENTIC_AGENT_PRESETS` with `key`, `label`, `description`, `agentRole`, `capabilities`, and `toolIds`.
2. Ensure the preset is included in `MAGENTIC_AGENT_PRESET_MAP` for lookup.
3. (Optional) Extend the Magentic Agent editor if you need bespoke UI fields or controls.

Once added, the new preset will automatically appear in the UI and can be selected when configuring Magentic agents.
