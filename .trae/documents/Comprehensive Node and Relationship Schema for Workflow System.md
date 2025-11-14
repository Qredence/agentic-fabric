## Objective
- Define a complete data schema for nodes, edges, and edge groups that matches the existing workflow code while adding validation rules, metadata, and versioning for robust interchange, integrity, and extensibility.

## Modeling Approach
- Dual-model strategy:
  - TypeScript interfaces for runtime safety and IDE assistance (aligned with `lib/workflow/types.ts`, `lib/workflow/executors.ts`, `lib/workflow/edges.ts`).
  - JSON Schema 2020-12 for data validation, interoperability, and persistence.
- Deliver schema files under `lib/workflow/schema/` (e.g., `workflow.schema.json`, `executor/*.schema.json`, `edge/*.schema.json`).

## Scope
1. Node Definitions
- Unique IDs: `id: string` (UUID/Nanoid); format: `^[A-Za-z0-9_-]+$`.
- Types/classes using discriminators (`variant` for UI nodes, `type` for executors):
  - `workflow`, `textBlock`, `attribute` (from `lib/workflow/types.ts:122-166`).
  - Executable nodes: `executor`, `function-executor`, `workflow-executor`, `agent-executor`, `request-info-executor`, `magentic-*` (from `lib/workflow/executors.ts:146-166`).
- Parameters:
  - Required per type (e.g., `functionName` for function-executor, `agentId` for agent-executor).
  - Optional typed fields with defaults (e.g., `temperature?: number` default `0.7`).
- Validation rules:
  - Numeric bounds (e.g., `temperature [0,1]`, `maxTokens ≥ 1`).
  - Enum constraints for `ToolMode` and `EdgeGroupType`.
  - String formats (`date-time` for timestamps; `uri` for code references if present).

2. Relationships
- Edges:
  - `id`, `source`, `target` (`lib/workflow/types.ts:31-37` and `executors.ts:62-76`).
  - `condition` with discriminator (`predicate`, `case`, `always`) (`lib/workflow/edges.ts:89-95`).
- Edge Groups (cardinality and direction):
  - `single`: one-to-one (`lib/workflow/edges.ts:6-10`).
  - `fan-in`: many→one with optional `aggregationStrategy` (`lib/workflow/edges.ts:15-23`).
  - `fan-out`: one→many with `broadcastMode` (`lib/workflow/edges.ts:28-35`).
  - `switch-case`: one→(0..n) with `switchExpression`, `cases[]`, `default` (`lib/workflow/edges.ts:40-66`).
- Cardinality constraints encoded in JSON Schema using `minItems`/`maxItems` and discriminator logic per group.

3. Metadata
- Common `metadata: object`, `version: string`, `createdAt`, `updatedAt` (`date-time`).
- Access control: `acl: { owner: string; read: string[]; write: string[]; roles?: string[] }`.
- Status flags: `status: enum("draft","active","disabled","deprecated")` with `reason?: string`.

## JSON Schema Structure (Highlights)
- `workflow.schema.json` top-level:
  - `$id`, `$schema`, `type: object`, `required: [id, name, executors, edges]`.
  - `executors: array` with `oneOf` referencing executor schemas.
  - `edges: array` referencing `edge/edge.schema.json`.
  - `edgeGroups: array` referencing `edge/edge-group.schema.json` (optional).
  - `metadata`, `version`, timestamps, ACL.
- `executor/*.schema.json` files with discriminators (`type`) mapping to each executor type’s required fields and typed constraints.
- `node-ui.schema.json` for `workflow`/`textBlock`/`attribute` visual nodes with `variant` discriminator.
- `edge/edge.schema.json` modeling base edge with optional `condition`.
- `edge/edge-group.schema.json` modeling single/fan-in/fan-out/switch-case with per-type rules.

## TypeScript Types (Additions)
- Extend `BaseExecutor` with `version?: string`, `createdAt?: string`, `updatedAt?: string`, `acl?: Acl`, `status?: StatusFlag` (without breaking existing code; optional fields for compatibility).
- Define `Acl`, `StatusFlag` types.
- Add `WorkflowDefinition` wrapper to unify executors, edges, groups, metadata (already present in `lib/workflow/executors.ts:51-57` — extend with `edgeGroups?: EdgeGroup[]`, timestamps, ACL).

## Integrity & Traversal
- Integrity:
  - Referential integrity enforced via JSON Schema with custom `source`/`target` referencing known executor IDs (documented; runtime validator to check referential consistency).
  - Cardinality via edge group schema.
- Traversal:
  - Index by `id` for nodes; adjacency lists from `edges` and `edgeGroups`.
  - Provide helper functions: `getIncoming(id)`, `getOutgoing(id)`, `topoSort()`, `findCycles()`.

## Versioning & Compatibility
- Schema `$id` versioned (e.g., `https://example.com/workflow/v1`).
- `version` field at workflow + executor levels; define migration rules for evolving types (e.g., temperature range changes).

## Extensibility
- Use discriminators to add new node types without breaking existing schemas.
- Metadata is free-form `Record<string, unknown>`.
- Edge groups allow future strategies (e.g., weighted fan-in) via optional fields.

## Documentation & Examples
- Markdown docs explaining each schema, required fields, defaults, and validation.
- Example JSON instances:
  - Agent executor node with tools, model, temperature.
  - Function executor with parameters.
  - Workflow with fan-out edges and a switch-case edge group.
- Add developer notes for querying patterns and integrity checks.

## Delivery Plan
- Create JSON Schema files under `lib/workflow/schema/`.
- Add TS type augmentations (optional fields) while preserving current runtime signatures.
- Add validation utilities (e.g., Ajv) for runtime validation in dev/test environments.
- Provide examples and docs.

## Verification
- Validate example JSON against schema.
- Unit tests for referential integrity and cardinality.
- Confirm code compiles and existing tests remain green.

## Next Step
- On approval, I will add the schema files, TS augmentations, validator utilities, examples, and documentation, and wire basic validation into existing tests for integrity.