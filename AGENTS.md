# Agents

Comprehensive guide to agent implementations, their configuration, presets, and how they participate in workflows and orchestration.

## Architecture Overview

- Shared protocol and types define how agents run, stream, and integrate tools.
  - `AgentProtocol` and run/stream signatures: `lib/workflow/agent.ts:8-16`
  - Common run options: `lib/workflow/agent.ts:21-30`
- Workflow embedding via executors:
  - Core `Executor` interface: `lib/workflow/executors.ts:21-25`
  - `AgentExecutor` fields: `lib/workflow/executors.ts:90-100`
  - Magentic orchestrator: `lib/workflow/executors.ts:145-150`
- Tool integration types and labels: `lib/workflow/tools.ts:1-22`, `lib/workflow/tools.ts:225-242`

## Agent Types & Purpose

- Base/Chat/Workflow agents:
  - `ChatAgent` for LLM chat clients and tool use: `lib/workflow/agent.ts:139-148`
  - `WorkflowAgent` wraps a workflow as an agent: `lib/workflow/agent.ts:227-232`
- Use Chat agents for conversational tasks with tools; use Workflow agents to expose orchestration or multi-step processes with custom input/output adapters.

## Configuration Options

- Protocol-level `AgentRunOptions` (system prompt, tools, model, temperature, maxTokens, toolMode, stream, metadata): `lib/workflow/agent.ts:21-30`
- Executor-level configuration for UI editors (`AgentExecutor`): `lib/workflow/executors.ts:90-100`
  - `agentId`, `agentType` (chat | workflow | magentic), `model`, `systemPrompt`, `temperature`, `maxTokens`, `toolMode`, `tools[]`

## Magentic Workflow Support

- Default orchestration and agent wiring seeded via `createExecutorFromNodeType` with Magentic metadata: `lib/workflow/conversion.ts:504-596`
- Canvas ↔ runtime conversions preserve metadata to rehydrate editors:
  - React Flow → Workflow: `lib/workflow/conversion.ts:73-168`
  - Workflow → React Flow: `lib/workflow/conversion.ts:173-232`

## Built-in Magentic Agent Presets

Defined in `lib/workflow/magentic-presets.ts:19-62`. Selecting a preset auto-populates label, description, role, capabilities, system prompt, and default tools. The `MAGENTIC_AGENT_PRESET_MAP` enables quick lookup.

| Key | Label | Role | Core Duties | Default Tools |
| --- | --- | --- | --- | --- |
| planner | Planner Agent | planner | Break work into steps; maintain fact/progress ledgers | magentic-task-ledger, magentic-progress-ledger |
| web | Web Surfer Agent | web-surfer | Search and summarise authoritative sources | web-browser, http-client |
| coder | Coder Agent | coder | Generate and run code to fulfil subtasks | hosted-code-interpreter |
| critic | Critic Agent | critic | Review outputs for accuracy, completeness, and adherence | analysis-notes |

## UI Editors & Metadata

- Magentic Agent editor supports preset selection and custom overrides:
  - Preset handling and metadata merge: `components/workflow-builder/executor-editors/magentic-agent-executor-editor.tsx:69-107`
  - Editable fields (role, capabilities, tools, system prompt): `components/workflow-builder/executor-editors/magentic-agent-executor-editor.tsx:143-211`
- Magentic Orchestrator editor:
  - Planning strategy, progress tracking, human-in-the-loop: `components/workflow-builder/executor-editors/magentic-orchestrator-executor-editor.tsx:75-140`
- Generic Agent editor for non-Magentic agents: `components/workflow-builder/executor-editors/agent-executor-editor.tsx:39-130`

## Tool Integration

- Tools can be protocol-based, AI functions, or hosted/MCP variants: `lib/workflow/tools.ts:160-186`
- Labels for UI are derived via `getToolTypeLabel`: `lib/workflow/tools.ts:225-242`

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
import { createExecutorFromNodeType } from '@/lib/workflow/conversion'

const orchestrator = createExecutorFromNodeType('magentic-orchestrator-executor', 'orch-1', 'Magentic Orchestrator')
const coderAgent = createExecutorFromNodeType('magentic-agent-executor', 'agent-coder', 'Coder', { presetKey: 'coder' })
```

### Editing via UI

- Drag “Magentic Orchestrator” and “Magentic Agent” from the Node Library: `components/workflow-builder/node-library.tsx`
- Select the node and edit fields in the corresponding editor.

## Validation

- Run focused conversion tests or the full suite:
  - `pnpm test`
  - `pnpm test -- conversion`
- General verification: `pnpm verify` and `pnpm build:ci`

## Extending Presets

1. Add a new entry to `MAGENTIC_AGENT_PRESETS` with `key`, `label`, `description`, `agentRole`, `capabilities`, and `toolIds`.
2. UI picks it up automatically via `MAGENTIC_AGENT_PRESET_MAP`.
3. Optionally extend editors to surface bespoke fields.
