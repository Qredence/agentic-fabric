import Ajv from "ajv";
import addFormats from "ajv-formats";
import workflowSchema from "./workflow.schema.json";
import edgeSchema from "./edge/edge.schema.json";
import edgeGroupSchema from "./edge/edge-group.schema.json";
import executorUnionSchema from "./executor/executor.union.schema.json";
import basePropsSchema from "./executor/executor.base.props.json";
import agentSchema from "./executor/agent-executor.schema.json";
import functionSchema from "./executor/function-executor.schema.json";
import workflowExecSchema from "./executor/workflow-executor.schema.json";
import requestInfoSchema from "./executor/request-info-executor.schema.json";
import magenticAgentSchema from "./executor/magentic-agent-executor.schema.json";
import magenticOrchestratorSchema from "./executor/magentic-orchestrator-executor.schema.json";
import baseExecutorSchema from "./executor/executor.schema.json";

const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
addFormats(ajv);

ajv.addSchema(workflowSchema);
ajv.addSchema(edgeSchema);
ajv.addSchema(edgeGroupSchema);
ajv.addSchema(executorUnionSchema);
ajv.addSchema(basePropsSchema);
ajv.addSchema(agentSchema);
ajv.addSchema(functionSchema);
ajv.addSchema(workflowExecSchema);
ajv.addSchema(requestInfoSchema);
ajv.addSchema(magenticAgentSchema);
ajv.addSchema(magenticOrchestratorSchema);
ajv.addSchema(baseExecutorSchema);

export function validateWorkflowDefinition(def: unknown): { valid: boolean; errors?: string[] } {
  const validate = ajv.getSchema(workflowSchema.$id as string) || ajv.compile(workflowSchema as any);
  const ok = validate(def);
  const errors = ok ? undefined : (validate.errors || []).map((e) => `${e.instancePath} ${e.message}`);
  return { valid: !!ok, errors };
}

export function checkReferentialIntegrity(def: any): { valid: boolean; errors?: string[] } {
  const errs: string[] = [];
  if (!def || !Array.isArray(def.executors) || !Array.isArray(def.edges)) return { valid: false, errors: ["Invalid structure"] };
  const ids = new Set<string>(def.executors.map((e: any) => e.id));
  for (const edge of def.edges) {
    if (!ids.has(edge.source)) errs.push(`Unknown source: ${edge.source}`);
    if (!ids.has(edge.target)) errs.push(`Unknown target: ${edge.target}`);
  }
  if (Array.isArray(def.edgeGroups)) {
    for (const g of def.edgeGroups) {
      if (g.type === "fan-in") {
        if (!ids.has(g.target)) errs.push(`Unknown fan-in target: ${g.target}`);
        for (const s of g.sources) if (!ids.has(s)) errs.push(`Unknown fan-in source: ${s}`);
      } else if (g.type === "fan-out") {
        if (!ids.has(g.source)) errs.push(`Unknown fan-out source: ${g.source}`);
        for (const t of g.targets) if (!ids.has(t)) errs.push(`Unknown fan-out target: ${t}`);
      } else if (g.type === "switch-case") {
        if (!ids.has(g.source)) errs.push(`Unknown switch-case source: ${g.source}`);
        for (const c of g.cases) if (!ids.has(c.target)) errs.push(`Unknown case target: ${c.target}`);
        if (g.default && !ids.has(g.default.target)) errs.push(`Unknown default target: ${g.default.target}`);
      }
    }
  }
  return { valid: errs.length === 0, errors: errs.length ? errs : undefined };
}
