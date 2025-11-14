module.exports = [
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@2.6.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/lib/workflow/magentic-presets.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAGENTIC_AGENT_PRESETS",
    ()=>MAGENTIC_AGENT_PRESETS,
    "MAGENTIC_AGENT_PRESET_MAP",
    ()=>MAGENTIC_AGENT_PRESET_MAP
]);
const MAGENTIC_AGENT_PRESETS = [
    {
        key: "planner",
        label: "Planner Agent",
        description: "Creates task plans, updates task ledger, assigns agents.",
        agentRole: "planner",
        capabilities: [
            "planning",
            "fact-gathering",
            "assignment"
        ],
        systemPrompt: "You are the planning specialist. Break down the task into actionable steps, keep the facts and plan ledgers updated, and assign the next best agent.",
        toolIds: [
            "magentic-task-ledger",
            "magentic-progress-ledger"
        ]
    },
    {
        key: "web",
        label: "Web Surfer Agent",
        description: "Searches and summarizes web sources to gather external facts.",
        agentRole: "web-surfer",
        capabilities: [
            "web-search",
            "summarisation"
        ],
        systemPrompt: "You are the web research specialist. Use browsing tools to gather and summarise authoritative information that helps the team.",
        toolIds: [
            "web-browser",
            "http-client"
        ]
    },
    {
        key: "coder",
        label: "Coder Agent",
        description: "Writes and runs code to fulfil assigned subtasks.",
        agentRole: "coder",
        capabilities: [
            "code-generation",
            "code-execution"
        ],
        systemPrompt: "You are responsible for writing and executing code to achieve the assigned goal. Produce correct, well-tested programs and explain results.",
        toolIds: [
            "hosted-code-interpreter"
        ]
    },
    {
        key: "critic",
        label: "Critic Agent",
        description: "Reviews work-in-progress and ensures quality before completion.",
        agentRole: "critic",
        capabilities: [
            "review",
            "quality-assurance"
        ],
        systemPrompt: "Review teammate output for accuracy, completeness, and adherence to plan. Flag issues and suggest improvements.",
        toolIds: [
            "analysis-notes"
        ]
    }
];
const MAGENTIC_AGENT_PRESET_MAP = MAGENTIC_AGENT_PRESETS.reduce((acc, preset)=>{
    acc[preset.key] = preset;
    return acc;
}, {});
}),
"[project]/lib/workflow/executors.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getExecutorTypeDescription",
    ()=>getExecutorTypeDescription,
    "getExecutorTypeLabel",
    ()=>getExecutorTypeLabel,
    "isAgentExecutor",
    ()=>isAgentExecutor,
    "isFunctionExecutor",
    ()=>isFunctionExecutor,
    "isMagenticAgentExecutor",
    ()=>isMagenticAgentExecutor,
    "isMagenticOrchestratorExecutor",
    ()=>isMagenticOrchestratorExecutor,
    "isRequestInfoExecutor",
    ()=>isRequestInfoExecutor,
    "isWorkflowExecutor",
    ()=>isWorkflowExecutor
]);
function isFunctionExecutor(executor) {
    return executor.type === "function-executor";
}
function isWorkflowExecutor(executor) {
    return executor.type === "workflow-executor";
}
function isAgentExecutor(executor) {
    return executor.type === "agent-executor";
}
function isRequestInfoExecutor(executor) {
    return executor.type === "request-info-executor";
}
function isMagenticAgentExecutor(executor) {
    return executor.type === "magentic-agent-executor";
}
function isMagenticOrchestratorExecutor(executor) {
    return executor.type === "magentic-orchestrator-executor";
}
function getExecutorTypeLabel(type) {
    const labels = {
        executor: "Executor",
        "function-executor": "Function",
        "workflow-executor": "Nested Workflow",
        "agent-executor": "Agent",
        "request-info-executor": "Request Info",
        "magentic-agent-executor": "Magentic Agent",
        "magentic-orchestrator-executor": "Magentic Orchestrator"
    };
    return labels[type] || type;
}
function getExecutorTypeDescription(type) {
    const descriptions = {
        executor: "Base executor for processing messages",
        "function-executor": "Execute a function as a workflow node",
        "workflow-executor": "Nest another workflow as an executor",
        "agent-executor": "Use an AI agent to process messages",
        "request-info-executor": "Gateway for external information requests",
        "magentic-agent-executor": "Magentic agent for multi-agent workflows",
        "magentic-orchestrator-executor": "Orchestrator for Magentic One workflows"
    };
    return descriptions[type] || "";
}
}),
"[project]/lib/workflow/edges.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createFanInEdgeGroup",
    ()=>createFanInEdgeGroup,
    "createFanOutEdgeGroup",
    ()=>createFanOutEdgeGroup,
    "createSingleEdgeGroup",
    ()=>createSingleEdgeGroup,
    "createSwitchCaseEdgeGroup",
    ()=>createSwitchCaseEdgeGroup,
    "getEdgeGroupTypeDescription",
    ()=>getEdgeGroupTypeDescription,
    "getEdgeGroupTypeLabel",
    ()=>getEdgeGroupTypeLabel,
    "isFanInEdgeGroup",
    ()=>isFanInEdgeGroup,
    "isFanOutEdgeGroup",
    ()=>isFanOutEdgeGroup,
    "isSingleEdgeGroup",
    ()=>isSingleEdgeGroup,
    "isSwitchCaseEdgeGroup",
    ()=>isSwitchCaseEdgeGroup
]);
function isSingleEdgeGroup(group) {
    return group.type === "single";
}
function isFanInEdgeGroup(group) {
    return group.type === "fan-in";
}
function isFanOutEdgeGroup(group) {
    return group.type === "fan-out";
}
function isSwitchCaseEdgeGroup(group) {
    return group.type === "switch-case";
}
function getEdgeGroupTypeLabel(type) {
    const labels = {
        single: "Single Edge",
        "fan-in": "Fan-In (Multiple Sources)",
        "fan-out": "Fan-Out (Multiple Targets)",
        "switch-case": "Switch/Case Routing"
    };
    return labels[type] || type;
}
function getEdgeGroupTypeDescription(type) {
    const descriptions = {
        single: "One-to-one connection between executors",
        "fan-in": "Multiple sources converge into one target",
        "fan-out": "One source broadcasts to multiple targets",
        "switch-case": "Conditional routing based on expression value"
    };
    return descriptions[type] || "";
}
function createSingleEdgeGroup(edge) {
    return {
        id: `edge-group-${edge.id}`,
        type: "single",
        edge
    };
}
function createFanInEdgeGroup(sources, target, edges, aggregationStrategy = "merge") {
    return {
        id: `fan-in-${Date.now()}`,
        type: "fan-in",
        sources,
        target,
        edges,
        aggregationStrategy
    };
}
function createFanOutEdgeGroup(source, targets, edges, broadcastMode = "parallel") {
    return {
        id: `fan-out-${Date.now()}`,
        type: "fan-out",
        source,
        targets,
        edges,
        broadcastMode
    };
}
function createSwitchCaseEdgeGroup(source, switchExpression, cases, defaultCase) {
    return {
        id: `switch-case-${Date.now()}`,
        type: "switch-case",
        source,
        switchExpression,
        cases,
        default: defaultCase
    };
}
}),
"[project]/lib/workflow/export/serializers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deserializeFromJSON",
    ()=>deserializeFromJSON,
    "deserializeFromYAML",
    ()=>deserializeFromYAML,
    "downloadWorkflow",
    ()=>downloadWorkflow,
    "serializeToJSON",
    ()=>serializeToJSON,
    "serializeToYAML",
    ()=>serializeToYAML
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$js$2d$yaml$40$4$2e$1$2e$1$2f$node_modules$2f$js$2d$yaml$2f$dist$2f$js$2d$yaml$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/dist/js-yaml.mjs [app-ssr] (ecmascript)");
;
function serializeToJSON(workflow, pretty = true) {
    const serialized = workflowToSerialized(workflow);
    return pretty ? JSON.stringify(serialized, null, 2) : JSON.stringify(serialized);
}
function serializeToYAML(workflow) {
    const serialized = workflowToSerialized(workflow);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$js$2d$yaml$40$4$2e$1$2e$1$2f$node_modules$2f$js$2d$yaml$2f$dist$2f$js$2d$yaml$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dump"](serialized, {
        indent: 2,
        lineWidth: -1,
        noRefs: true
    });
}
function deserializeFromJSON(json) {
    const parsed = JSON.parse(json);
    return serializedToWorkflow(parsed);
}
function deserializeFromYAML(yamlString) {
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$js$2d$yaml$40$4$2e$1$2e$1$2f$node_modules$2f$js$2d$yaml$2f$dist$2f$js$2d$yaml$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["load"](yamlString);
    return serializedToWorkflow(parsed);
}
/**
 * Convert workflow to serialized format
 */ function workflowToSerialized(workflow) {
    return {
        id: workflow.id,
        name: workflow.name,
        version: workflow.version,
        description: workflow.description,
        executors: workflow.executors.map(executorToSerialized),
        edges: workflow.edges.map(edgeToSerialized),
        edgeGroups: workflow.edgeGroups?.map(edgeGroupToSerialized),
        metadata: workflow.metadata
    };
}
/**
 * Convert serialized format to workflow
 */ function serializedToWorkflow(serialized) {
    return {
        id: serialized.id,
        name: serialized.name,
        version: serialized.version,
        description: serialized.description,
        executors: serialized.executors.map(serializedToExecutor),
        edges: serialized.edges.map(serializedToEdge),
        edgeGroups: serialized.edgeGroups?.map(serializedToEdgeGroup),
        metadata: serialized.metadata
    };
}
/**
 * Convert executor to serialized format
 */ function executorToSerialized(executor) {
    const serialized = {
        id: executor.id,
        type: executor.type
    };
    if (executor.label) {
        serialized.label = executor.label;
    }
    if (executor.description) {
        serialized.description = executor.description;
    }
    // Copy all other properties
    Object.keys(executor).forEach((key)=>{
        if (![
            "id",
            "type",
            "label",
            "description"
        ].includes(key)) {
            serialized[key] = executor[key];
        }
    });
    return serialized;
}
/**
 * Convert serialized executor to executor
 */ function serializedToExecutor(serialized) {
    const { id, type, ...rest } = serialized;
    const executor = {
        id,
        type,
        ...rest
    };
    if (serialized.label) {
        executor.label = serialized.label;
    }
    if (serialized.description) {
        executor.description = serialized.description;
    }
    return executor;
}
/**
 * Convert edge to serialized format
 */ function edgeToSerialized(edge) {
    const serialized = {
        id: edge.id,
        source: edge.source,
        target: edge.target
    };
    if (edge.condition) {
        if (edge.condition.type === "predicate") {
            serialized.condition = {
                type: edge.condition.type,
                expression: edge.condition.expression
            };
        } else if (edge.condition.type === "case") {
            serialized.condition = {
                type: edge.condition.type,
                caseValue: edge.condition.caseValue
            };
        }
    }
    if (edge.metadata) {
        serialized.metadata = edge.metadata;
    }
    return serialized;
}
/**
 * Convert serialized edge to edge
 */ function serializedToEdge(serialized) {
    const edge = {
        id: serialized.id,
        source: serialized.source,
        target: serialized.target
    };
    if (serialized.condition && (serialized.condition.type === "predicate" || serialized.condition.type === "case")) {
        if (serialized.condition.type === "predicate") {
            edge.condition = {
                type: "predicate",
                expression: serialized.condition.expression
            };
        } else {
            edge.condition = {
                type: "case",
                caseValue: serialized.condition.caseValue
            };
        }
    }
    if (serialized.metadata) {
        edge.metadata = serialized.metadata;
    }
    return edge;
}
/**
 * Convert edge group to serialized format
 */ function edgeGroupToSerialized(group) {
    const { id, type, ...rest } = group;
    const serialized = {
        id,
        type,
        ...rest
    };
    return serialized;
}
/**
 * Convert serialized edge group to edge group
 */ function serializedToEdgeGroup(serialized) {
    // This is a simplified conversion - actual implementation would need
    // to handle each edge group type specifically
    return serialized;
}
function downloadWorkflow(workflow, format, filename) {
    const content = format === "json" ? serializeToJSON(workflow, true) : serializeToYAML(workflow);
    const blob = new Blob([
        content
    ], {
        type: format === "json" ? "application/json" : "text/yaml"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `${workflow.id || "workflow"}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
}),
"[project]/lib/workflow/workflow.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createWorkflowBuilder",
    ()=>createWorkflowBuilder,
    "validateWorkflow",
    ()=>validateWorkflow,
    "workflowDefinitionToWorkflow",
    ()=>workflowDefinitionToWorkflow
]);
function createWorkflowBuilder(id, name) {
    const workflow = {
        id,
        name,
        executors: [],
        edges: [],
        edgeGroups: [],
        metadata: {}
    };
    return {
        workflow,
        addExecutor (executor) {
            this.workflow.executors.push(executor);
            return this;
        },
        addExecutors (executors) {
            this.workflow.executors.push(...executors);
            return this;
        },
        addEdge (source, target, condition) {
            const edge = {
                id: `edge-${this.workflow.edges.length + 1}`,
                source,
                target,
                condition: condition ? {
                    type: condition.type,
                    expression: condition.expression,
                    caseValue: condition.caseValue
                } : undefined
            };
            this.workflow.edges.push(edge);
            return this;
        },
        addEdges (edges) {
            this.workflow.edges.push(...edges);
            return this;
        },
        addEdgeGroup (group) {
            if (!this.workflow.edgeGroups) {
                this.workflow.edgeGroups = [];
            }
            this.workflow.edgeGroups.push(group);
            return this;
        },
        setMetadata (metadata) {
            this.workflow.metadata = {
                ...this.workflow.metadata,
                ...metadata
            };
            return this;
        },
        build () {
            return {
                ...this.workflow
            };
        }
    };
}
function validateWorkflow(workflow) {
    const errors = [];
    const warnings = [];
    // Check for duplicate executor IDs
    const executorIds = new Set();
    for (const executor of workflow.executors){
        if (executorIds.has(executor.id)) {
            errors.push({
                code: "duplicate-executor-id",
                message: `Duplicate executor ID: ${executor.id}`,
                executorId: executor.id
            });
        }
        executorIds.add(executor.id);
    }
    // Check for duplicate edge IDs
    const edgeIds = new Set();
    for (const edge of workflow.edges){
        if (edgeIds.has(edge.id)) {
            errors.push({
                code: "duplicate-edge-id",
                message: `Duplicate edge ID: ${edge.id}`,
                edgeId: edge.id
            });
        }
        edgeIds.add(edge.id);
        // Check that source and target executors exist
        if (!executorIds.has(edge.source)) {
            errors.push({
                code: "invalid-edge-source",
                message: `Edge source executor not found: ${edge.source}`,
                edgeId: edge.id,
                executorId: edge.source
            });
        }
        if (!executorIds.has(edge.target)) {
            errors.push({
                code: "invalid-edge-target",
                message: `Edge target executor not found: ${edge.target}`,
                edgeId: edge.id,
                executorId: edge.target
            });
        }
    }
    // Check for orphaned executors (no incoming or outgoing edges)
    for (const executor of workflow.executors){
        const hasIncoming = workflow.edges.some((e)=>e.target === executor.id);
        const hasOutgoing = workflow.edges.some((e)=>e.source === executor.id);
        if (!hasIncoming && !hasOutgoing) {
            warnings.push({
                code: "orphaned-executor",
                message: `Executor has no connections: ${executor.id}`,
                executorId: executor.id
            });
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
function workflowDefinitionToWorkflow(definition) {
    return {
        id: definition.id,
        name: definition.name,
        executors: definition.executors,
        edges: definition.edges.map((edge)=>({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                condition: edge.condition ? {
                    type: edge.condition.type,
                    expression: edge.condition.expression,
                    caseValue: edge.condition.caseValue
                } : undefined
            })),
        metadata: definition.metadata
    };
}
}),
"[project]/lib/workflow/export/validator.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateWorkflowExtended",
    ()=>validateWorkflowExtended,
    "validateWorkflowSchema",
    ()=>validateWorkflowSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$workflow$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workflow/workflow.ts [app-ssr] (ecmascript)");
;
function validateWorkflowExtended(workflow) {
    const baseValidation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$workflow$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateWorkflow"])(workflow);
    const typeErrors = [];
    const connectivityWarnings = [];
    // Validate executor types
    for (const executor of workflow.executors){
        const typeError = validateExecutorType(executor);
        if (typeError) {
            typeErrors.push(typeError);
        }
    }
    // Validate edge type compatibility
    for (const edge of workflow.edges){
        const sourceExecutor = workflow.executors.find((e)=>e.id === edge.source);
        const targetExecutor = workflow.executors.find((e)=>e.id === edge.target);
        if (sourceExecutor && targetExecutor) {
            const compatibilityError = validateEdgeCompatibility(sourceExecutor, targetExecutor, edge);
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }
    }
    // Check connectivity
    for (const executor of workflow.executors){
        const connected = getConnectedExecutors(workflow, executor.id);
        if (connected.incoming.length === 0 && connected.outgoing.length === 0) {
            connectivityWarnings.push({
                code: "isolated-executor",
                message: `Executor ${executor.id} is isolated (no connections)`,
                executorId: executor.id
            });
        } else if (connected.incoming.length === 0) {
            connectivityWarnings.push({
                code: "no-incoming-edges",
                message: `Executor ${executor.id} has no incoming edges`,
                executorId: executor.id,
                connectedExecutors: connected.outgoing
            });
        } else if (connected.outgoing.length === 0) {
            connectivityWarnings.push({
                code: "no-outgoing-edges",
                message: `Executor ${executor.id} has no outgoing edges`,
                executorId: executor.id,
                connectedExecutors: connected.incoming
            });
        }
    }
    return {
        ...baseValidation,
        typeErrors,
        connectivityWarnings
    };
}
/**
 * Validate executor type
 */ function validateExecutorType(executor) {
    const validTypes = [
        "executor",
        "function-executor",
        "workflow-executor",
        "agent-executor",
        "request-info-executor",
        "magentic-agent-executor",
        "magentic-orchestrator-executor"
    ];
    if (!validTypes.includes(executor.type)) {
        return {
            code: "invalid-executor-type",
            message: `Invalid executor type: ${executor.type}`,
            executorId: executor.id,
            expectedType: validTypes.join(" | "),
            actualType: executor.type
        };
    }
    return null;
}
/**
 * Validate edge compatibility between executors
 */ function validateEdgeCompatibility(source, target, edge) {
    // Basic compatibility checks
    // In a full implementation, this would check message type compatibility
    // For now, we just ensure both executors exist and are valid
    // Check if source executor can produce messages
    // Check if target executor can consume messages from source
    // This is a simplified check - actual implementation would need
    // to validate message type compatibility
    return null;
}
/**
 * Get connected executors for a given executor
 */ function getConnectedExecutors(workflow, executorId) {
    const incoming = workflow.edges.filter((e)=>e.target === executorId).map((e)=>e.source);
    const outgoing = workflow.edges.filter((e)=>e.source === executorId).map((e)=>e.target);
    return {
        incoming,
        outgoing
    };
}
function validateWorkflowSchema(workflow) {
    const errors = [];
    if (!workflow || typeof workflow !== "object") {
        errors.push("Workflow must be an object");
        return {
            valid: false,
            errors
        };
    }
    const wf = workflow;
    if (!wf.id || typeof wf.id !== "string") {
        errors.push("Workflow must have a string 'id' property");
    }
    if (wf.executors) {
        if (!Array.isArray(wf.executors)) {
            errors.push("Workflow 'executors' must be an array");
        } else {
            wf.executors.forEach((executor, idx)=>{
                if (!executor || typeof executor !== "object") {
                    errors.push(`Executor at index ${idx} must be an object`);
                } else {
                    const exec = executor;
                    if (!exec.id || typeof exec.id !== "string") {
                        errors.push(`Executor at index ${idx} must have a string 'id' property`);
                    }
                    if (!exec.type || typeof exec.type !== "string") {
                        errors.push(`Executor at index ${idx} must have a string 'type' property`);
                    }
                }
            });
        }
    }
    if (wf.edges) {
        if (!Array.isArray(wf.edges)) {
            errors.push("Workflow 'edges' must be an array");
        } else {
            wf.edges.forEach((edge, idx)=>{
                if (!edge || typeof edge !== "object") {
                    errors.push(`Edge at index ${idx} must be an object`);
                } else {
                    const e = edge;
                    if (!e.id || typeof e.id !== "string") {
                        errors.push(`Edge at index ${idx} must have a string 'id' property`);
                    }
                    if (!e.source || typeof e.source !== "string") {
                        errors.push(`Edge at index ${idx} must have a string 'source' property`);
                    }
                    if (!e.target || typeof e.target !== "string") {
                        errors.push(`Edge at index ${idx} must have a string 'target' property`);
                    }
                }
            });
        }
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
}),
"[project]/lib/workflow/conversion.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createExecutorFromNodeType",
    ()=>createExecutorFromNodeType,
    "createNodeDataFromExecutorType",
    ()=>createNodeDataFromExecutorType,
    "reactFlowToWorkflow",
    ()=>reactFlowToWorkflow,
    "workflowToReactFlow",
    ()=>workflowToReactFlow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$magentic$2d$presets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workflow/magentic-presets.ts [app-ssr] (ecmascript)");
;
function reactFlowToWorkflow(nodes, edges, workflowId = "workflow-1", workflowName) {
    // Extract executors from nodes
    const executors = [];
    const nodePositions = {};
    for (const node of nodes){
        // Store position for later restoration
        nodePositions[node.id] = node.position;
        // Handle executor nodes
        if (isExecutorNodeData(node.data)) {
            const executor = nodeToExecutor(node);
            if (executor) {
                // Store position in metadata
                if (!executor.metadata) {
                    executor.metadata = {};
                }
                executor.metadata.position = node.position;
                executors.push(executor);
            }
        }
    // Edge groups are handled separately - they're represented as nodes but contain edge group data
    }
    // Convert edges
    const workflowEdges = edges.map((edge)=>{
        const condition = edge.data?.condition;
        let edgeCondition = undefined;
        if (condition) {
            if (condition.type === "predicate") {
                edgeCondition = {
                    type: "predicate",
                    expression: condition.expression
                };
            } else if (condition.type === "case") {
                edgeCondition = {
                    type: "case",
                    caseValue: condition.caseValue
                };
            }
        }
        return {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            condition: edgeCondition,
            metadata: {
                ...edge.data,
                type: edge.type
            }
        };
    });
    // Extract edge groups from nodes
    const edgeGroups = [];
    for (const node of nodes){
        if (isEdgeGroupNode(node.data)) {
            const group = nodeDataToEdgeGroup(node.data);
            if (group) {
                edgeGroups.push(group);
            }
        }
    }
    return {
        id: workflowId,
        name: workflowName,
        executors,
        edges: workflowEdges,
        edgeGroups: edgeGroups.length > 0 ? edgeGroups : undefined,
        metadata: (()=>{
            const metadata = {
                createdAt: new Date().toISOString(),
                custom: {}
            };
            if (Object.keys(nodePositions).length > 0) {
                metadata.custom.nodePositions = nodePositions;
                metadata.nodePositions = nodePositions;
            }
            if (!metadata.custom || Object.keys(metadata.custom).length === 0) {
                delete metadata.custom;
            }
            return metadata;
        })()
    };
}
function workflowToReactFlow(workflow) {
    const nodes = [];
    const edges = [];
    // Convert executors to nodes
    for (const executor of workflow.executors){
        const nodePositions = workflow.metadata?.custom?.nodePositions ?? workflow.metadata?.nodePositions;
        const position = nodePositions?.[executor.id] || {
            x: 0,
            y: 0
        };
        const nodeData = executorToNodeData(executor);
        if (nodeData) {
            nodes.push({
                id: executor.id,
                type: getNodeTypeFromExecutor(executor),
                position,
                data: nodeData
            });
        }
    }
    // Convert edge groups to nodes if they exist
    if (workflow.edgeGroups) {
        for (const group of workflow.edgeGroups){
            const nodeData = edgeGroupToNodeData(group);
            if (nodeData) {
                // Position edge group nodes (would need layout logic in real implementation)
                const position = {
                    x: 0,
                    y: 0
                };
                nodes.push({
                    id: group.id,
                    type: getNodeTypeFromEdgeGroup(group),
                    position,
                    data: nodeData
                });
            }
        }
    }
    // Convert edges
    for (const edge of workflow.edges){
        edges.push({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: "animated",
            data: {
                condition: edge.condition,
                ...edge.metadata
            }
        });
    }
    return {
        nodes,
        edges
    };
}
/**
 * Check if node data is executor data
 */ function isExecutorNodeData(data) {
    return data.variant === "executor" || data.variant === "function-executor" || data.variant === "agent-executor" || data.variant === "workflow-executor" || data.variant === "request-info-executor";
}
/**
 * Check if node data is edge group data
 */ function isEdgeGroupNode(data) {
    return data.variant === "fan-in" || data.variant === "fan-out" || data.variant === "switch-case";
}
/**
 * Convert React Flow node to executor
 */ function nodeToExecutor(node) {
    const data = node.data;
    if (!isExecutorNodeData(data)) {
        return null;
    }
    if (data.executor) {
        return {
            ...data.executor
        };
    }
    // Fallback: create basic executor from node
    return {
        id: node.id,
        type: data.executorType || "executor",
        label: data.label,
        description: data.description
    };
}
/**
 * Convert executor to React Flow node data
 */ function executorToNodeData(executor) {
    const executorType = executor.type;
    switch(executorType){
        case "function-executor":
            {
                const funcExec = executor;
                return {
                    variant: "function-executor",
                    handles: {
                        target: true,
                        source: true
                    },
                    executor: funcExec,
                    label: funcExec.label,
                    description: funcExec.description
                };
            }
        case "agent-executor":
            {
                const agentExec = executor;
                return {
                    variant: "agent-executor",
                    handles: {
                        target: true,
                        source: true
                    },
                    executor: agentExec,
                    label: agentExec.label,
                    description: agentExec.description
                };
            }
        case "magentic-agent-executor":
            {
                const magenticAgent = executor;
                return {
                    variant: "agent-executor",
                    handles: {
                        target: true,
                        source: true
                    },
                    executor: magenticAgent,
                    label: magenticAgent.label,
                    description: magenticAgent.description
                };
            }
        case "workflow-executor":
            {
                const workflowExec = executor;
                return {
                    variant: "workflow-executor",
                    handles: {
                        target: true,
                        source: true
                    },
                    executor: workflowExec,
                    label: workflowExec.label,
                    description: workflowExec.description
                };
            }
        case "request-info-executor":
            {
                const reqExec = executor;
                return {
                    variant: "request-info-executor",
                    handles: {
                        target: true,
                        source: true
                    },
                    executor: reqExec,
                    label: reqExec.label,
                    description: reqExec.description
                };
            }
        case "magentic-orchestrator-executor":
            {
                const magenticOrchestrator = executor;
                return {
                    variant: "executor",
                    handles: {
                        target: true,
                        source: true
                    },
                    executor: magenticOrchestrator,
                    executorType: "magentic-orchestrator-executor",
                    label: magenticOrchestrator.label,
                    description: magenticOrchestrator.description
                };
            }
        default:
            {
                if (executor.type === "magentic-agent-executor") {
                    const magAgent = executor;
                    return {
                        variant: "agent-executor",
                        handles: {
                            target: true,
                            source: true
                        },
                        executor: magAgent,
                        label: magAgent.label,
                        description: magAgent.description
                    };
                }
                if (executor.type === "magentic-orchestrator-executor") {
                    const magOrchestrator = executor;
                    return {
                        variant: "executor",
                        handles: {
                            target: true,
                            source: true
                        },
                        executor: magOrchestrator,
                        executorType: "magentic-orchestrator-executor",
                        label: magOrchestrator.label,
                        description: magOrchestrator.description
                    };
                }
                return {
                    variant: "executor",
                    handles: {
                        target: true,
                        source: true
                    },
                    executor,
                    executorType: executorType || "executor",
                    label: executor.label,
                    description: executor.description
                };
            }
    }
}
/**
 * Get React Flow node type from executor
 */ function getNodeTypeFromExecutor(executor) {
    const executorType = executor.type;
    switch(executorType){
        case "function-executor":
            return "function-executor";
        case "agent-executor":
            return "agent-executor";
        case "magentic-agent-executor":
            return "magentic-agent-executor";
        case "workflow-executor":
            return "workflow-executor";
        case "request-info-executor":
            return "request-info-executor";
        case "magentic-orchestrator-executor":
            return "magentic-orchestrator-executor";
        default:
            return "executor";
    }
}
/**
 * Convert node data to edge group
 */ function nodeDataToEdgeGroup(data) {
    if (data.variant === "fan-in" && "group" in data) {
        return data.group;
    }
    if (data.variant === "fan-out" && "group" in data) {
        return data.group;
    }
    if (data.variant === "switch-case" && "group" in data) {
        return data.group;
    }
    return null;
}
/**
 * Convert edge group to node data
 */ function edgeGroupToNodeData(group) {
    switch(group.type){
        case "fan-in":
            {
                const fanIn = group;
                return {
                    variant: "fan-in",
                    handles: {
                        target: true,
                        source: true,
                        sourceCount: fanIn.sources.length
                    },
                    group: fanIn
                };
            }
        case "fan-out":
            {
                const fanOut = group;
                return {
                    variant: "fan-out",
                    handles: {
                        target: true,
                        source: true,
                        targetCount: fanOut.targets.length
                    },
                    group: fanOut
                };
            }
        case "switch-case":
            {
                const switchCase = group;
                return {
                    variant: "switch-case",
                    handles: {
                        target: true,
                        source: true,
                        caseCount: switchCase.cases.length
                    },
                    group: switchCase
                };
            }
        default:
            return null;
    }
}
/**
 * Get React Flow node type from edge group
 */ function getNodeTypeFromEdgeGroup(group) {
    switch(group.type){
        case "fan-in":
            return "fan-in";
        case "fan-out":
            return "fan-out";
        case "switch-case":
            return "switch-case";
        default:
            return "executor";
    }
}
function createExecutorFromNodeType(nodeType, id, label, options) {
    switch(nodeType){
        case "function-executor":
            return {
                id,
                type: "function-executor",
                label: label || "Function Executor",
                description: "Execute a function as a workflow node"
            };
        case "agent-executor":
            return {
                id,
                type: "agent-executor",
                label: label || "Agent Executor",
                description: "Use an AI agent to process messages"
            };
        case "workflow-executor":
            return {
                id,
                type: "workflow-executor",
                label: label || "Workflow Executor",
                description: "Nest another workflow as an executor",
                workflowId: ""
            };
        case "request-info-executor":
            return {
                id,
                type: "request-info-executor",
                label: label || "Request Info Executor",
                description: "Gateway for external information requests",
                requestType: ""
            };
        case "magentic-orchestrator-executor":
            {
                return {
                    id,
                    type: "magentic-orchestrator-executor",
                    label: label || "Magentic Orchestrator",
                    description: "Coordinates Magentic agents, planning and routing messages",
                    planningStrategy: "adaptive",
                    progressTracking: true,
                    humanInTheLoop: false,
                    metadata: {
                        source: "agent-framework",
                        magentic: {
                            presetKey: "orchestrator",
                            planningStrategy: "adaptive",
                            progressTracking: true,
                            humanInTheLoop: false
                        }
                    }
                };
            }
        case "magentic-agent-executor":
            {
                const preset = options?.presetKey && __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$magentic$2d$presets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAGENTIC_AGENT_PRESET_MAP"][options.presetKey] ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$magentic$2d$presets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAGENTIC_AGENT_PRESET_MAP"][options.presetKey] : undefined;
                return {
                    id,
                    type: "magentic-agent-executor",
                    label: label || preset?.label || "Magentic Agent",
                    description: preset?.description || "Specialised Magentic agent that collaborates under the orchestrator",
                    agentRole: preset?.agentRole || "generalist",
                    capabilities: preset?.capabilities,
                    systemPrompt: preset?.systemPrompt,
                    tools: preset?.toolIds?.map((toolId)=>({
                            toolId,
                            enabled: true
                        })),
                    metadata: {
                        source: "agent-framework",
                        magentic: {
                            presetKey: preset?.key ?? null,
                            agentRole: preset?.agentRole || "generalist",
                            capabilities: preset?.capabilities ?? [],
                            toolIds: preset?.toolIds ?? []
                        }
                    }
                };
            }
        default:
            return {
                id,
                type: "executor",
                label: label || "Executor",
                description: "Base executor for processing messages"
            };
    }
}
function createNodeDataFromExecutorType(executorType, executor) {
    switch(executorType){
        case "function-executor":
            return {
                variant: "function-executor",
                handles: {
                    target: true,
                    source: true
                },
                executor: executor
            };
        case "agent-executor":
            return {
                variant: "agent-executor",
                handles: {
                    target: true,
                    source: true
                },
                executor: executor
            };
        case "magentic-agent-executor":
            return {
                variant: "agent-executor",
                handles: {
                    target: true,
                    source: true
                },
                executor: executor
            };
        case "workflow-executor":
            return {
                variant: "workflow-executor",
                handles: {
                    target: true,
                    source: true
                },
                executor: executor
            };
        case "request-info-executor":
            return {
                variant: "request-info-executor",
                handles: {
                    target: true,
                    source: true
                },
                executor: executor
            };
        case "magentic-orchestrator-executor":
            return {
                variant: "executor",
                handles: {
                    target: true,
                    source: true
                },
                executor: executor,
                executorType: "magentic-orchestrator-executor"
            };
        default:
            return {
                variant: "executor",
                handles: {
                    target: true,
                    source: true
                },
                executor,
                executorType: "executor"
            };
    }
}
}),
"[project]/lib/workflow/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultAttributeNodeData",
    ()=>defaultAttributeNodeData,
    "defaultHandles",
    ()=>defaultHandles,
    "defaultTextBlockData",
    ()=>defaultTextBlockData,
    "defaultWorkflowStepData",
    ()=>defaultWorkflowStepData
]);
const defaultHandles = {
    target: true,
    source: true
};
const defaultWorkflowStepData = (overrides = {})=>({
        variant: "workflow",
        handles: overrides.handles ?? defaultHandles,
        label: overrides.label ?? "New Step",
        description: overrides.description ?? "Customize this workflow step",
        content: overrides.content ?? "Drag to reposition or connect to an existing node.",
        footer: overrides.footer ?? "Status: Draft"
    });
const defaultTextBlockData = (overrides = {})=>({
        variant: "textBlock",
        handles: overrides.handles ?? defaultHandles,
        title: overrides.title ?? "Text",
        model: overrides.model ?? "GPT-5",
        placeholder: overrides.placeholder ?? 'Try "A script excerpt of a romantic meeting in Paris"',
        showSuggestions: overrides.showSuggestions ?? true,
        collapsed: overrides.collapsed ?? false
    });
const defaultAttributeNodeData = (overrides = {})=>({
        variant: "attribute",
        handles: overrides.handles ?? defaultHandles,
        title: overrides.title ?? "Attributes",
        model: overrides.model ?? "GPT-5",
        attributes: overrides.attributes ?? [],
        collapsed: overrides.collapsed ?? false
    });
}),
"[project]/public/logo-lightmode.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/logo-lightmode.876969f9.svg");}),
"[project]/public/logo-lightmode.svg.mjs { IMAGE => \"[project]/public/logo-lightmode.svg (static in ecmascript, tag client)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$logo$2d$lightmode$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/public/logo-lightmode.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$logo$2d$lightmode$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 25,
    height: 24,
    blurWidth: 0,
    blurHeight: 0
};
}),
"[project]/public/logo-darkmode.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/logo-darkmode.62c7585e.svg");}),
"[project]/public/logo-darkmode.svg.mjs { IMAGE => \"[project]/public/logo-darkmode.svg (static in ecmascript, tag client)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$logo$2d$darkmode$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/public/logo-darkmode.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$logo$2d$darkmode$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 25,
    height: 24,
    blurWidth: 0,
    blurHeight: 0
};
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.0_@babel+core@7.28.5_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.0_@babel+core@7.28.5_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$xyflow$2b$react$40$12$2e$9$2e$3_$40$types$2b$react$40$19$2e$2$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@xyflow+react@12.9.3_@types+react@19.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/@xyflow/react/dist/esm/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$xyflow$2b$system$40$0$2e$0$2e$73$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@xyflow+system@0.0.73/node_modules/@xyflow/system/dist/esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$canvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/canvas.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$connection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/connection.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$edge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/edge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$edge$2d$node$2d$dropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow-builder/edge-node-dropdown.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/node.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/toolbar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$text$2d$block$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/text-block-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$attribute$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/attribute-node.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$actions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/actions.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pencil.js [app-ssr] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/nanoid@5.1.6/node_modules/nanoid/index.js [app-ssr] (ecmascript) <locals>");
// Import executor node components
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$executors$2f$executor$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/executors/executor-node.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$executors$2f$function$2d$executor$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/executors/function-executor-node.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$executors$2f$agent$2d$executor$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/executors/agent-executor-node.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$executors$2f$workflow$2d$executor$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/executors/workflow-executor-node.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$executors$2f$request$2d$info$2d$executor$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/executors/request-info-executor-node.tsx [app-ssr] (ecmascript)");
// Import edge group components
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$edge$2d$groups$2f$fan$2d$in$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/edge-groups/fan-in-node.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$edge$2d$groups$2f$fan$2d$out$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/edge-groups/fan-out-node.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$edge$2d$groups$2f$switch$2d$case$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-elements/edge-groups/switch-case-node.tsx [app-ssr] (ecmascript)");
// Import workflow builder components
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$node$2d$library$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow-builder/node-library.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$properties$2d$panel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow-builder/properties-panel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$export$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow-builder/export-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$import$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow-builder/import-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$top$2d$navigation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow-builder/top-navigation.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$bottom$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workflow-builder/bottom-controls.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workflow/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$conversion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workflow/conversion.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$magentic$2d$presets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workflow/magentic-presets.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const nodeIds = {
    start: "start",
    process1: "process1",
    process2: "process2",
    decision: "decision",
    output1: "output1",
    output2: "output2",
    textBlock: "textBlock",
    attribute: "attribute"
};
const initialNodes = [
    {
        id: nodeIds.start,
        type: "workflow",
        position: {
            x: 0,
            y: 0
        },
        data: {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultWorkflowStepData"])({
                handles: {
                    target: false,
                    source: true
                },
                label: "Start",
                description: "Initialize workflow",
                content: "Triggered by user action at 09:30 AM",
                footer: "Status: Ready"
            }),
            ...{}
        }
    },
    {
        id: nodeIds.process1,
        type: "workflow",
        position: {
            x: 500,
            y: 0
        },
        data: {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultWorkflowStepData"])({
                handles: {
                    target: true,
                    source: true
                },
                label: "Process Data",
                description: "Transform input",
                content: "Validating 1,234 records and applying business rules",
                footer: "Duration: ~2.5s"
            }),
            ...{}
        }
    },
    {
        id: nodeIds.decision,
        type: "workflow",
        position: {
            x: 1000,
            y: 0
        },
        data: {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultWorkflowStepData"])({
                handles: {
                    target: true,
                    source: true
                },
                label: "Decision Point",
                description: "Route based on conditions",
                content: "Evaluating: data.status === 'valid' && data.score > 0.8",
                footer: "Confidence: 94%"
            }),
            ...{}
        }
    },
    {
        id: nodeIds.output1,
        type: "workflow",
        position: {
            x: 1500,
            y: -300
        },
        data: {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultWorkflowStepData"])({
                handles: {
                    target: true,
                    source: true
                },
                label: "Success Path",
                description: "Handle success case",
                content: "1,156 records passed validation (93.7%)",
                footer: "Next: Send to production"
            }),
            ...{}
        }
    },
    {
        id: nodeIds.output2,
        type: "workflow",
        position: {
            x: 1500,
            y: 300
        },
        data: {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultWorkflowStepData"])({
                handles: {
                    target: true,
                    source: true
                },
                label: "Error Path",
                description: "Handle error case",
                content: "78 records failed validation (6.3%)",
                footer: "Next: Queue for review"
            }),
            ...{}
        }
    },
    {
        id: nodeIds.process2,
        type: "workflow",
        position: {
            x: 2000,
            y: 0
        },
        data: {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultWorkflowStepData"])({
                handles: {
                    target: true,
                    source: false
                },
                label: "Complete",
                description: "Finalize workflow",
                content: "All records processed and routed successfully",
                footer: "Total time: 4.2s"
            }),
            ...{}
        }
    },
    {
        id: nodeIds.textBlock,
        type: "textBlock",
        position: {
            x: 600,
            y: -250
        },
        data: {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultTextBlockData"])({
                title: "Creative brief",
                placeholder: "Outline the project scope and key messaging",
                showSuggestions: true
            }),
            ...{}
        }
    },
    {
        id: nodeIds.attribute,
        type: "attribute",
        position: {
            x: 600,
            y: 250
        },
        data: {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultAttributeNodeData"])({
                title: "Generation settings",
                attributes: [
                    {
                        id: "tone",
                        label: "Tone",
                        type: "select",
                        options: [
                            "Formal",
                            "Neutral",
                            "Playful"
                        ],
                        value: "Neutral"
                    },
                    {
                        id: "temperature",
                        label: "Temperature",
                        type: "slider",
                        min: 0,
                        max: 1,
                        step: 0.05,
                        value: 0.7
                    },
                    {
                        id: "length",
                        label: "Length",
                        type: "progress",
                        value: 40
                    }
                ]
            }),
            ...{}
        }
    }
];
const initialEdges = [
    {
        id: "edge1",
        source: nodeIds.start,
        target: nodeIds.process1,
        type: "animated"
    },
    {
        id: "edge2",
        source: nodeIds.process1,
        target: nodeIds.decision,
        type: "animated"
    },
    {
        id: "edge3",
        source: nodeIds.decision,
        target: nodeIds.output1,
        type: "animated"
    },
    {
        id: "edge4",
        source: nodeIds.decision,
        target: nodeIds.output2,
        type: "temporary"
    },
    {
        id: "edge5",
        source: nodeIds.output1,
        target: nodeIds.process2,
        type: "animated"
    },
    {
        id: "edge6",
        source: nodeIds.output2,
        target: nodeIds.process2,
        type: "temporary"
    }
];
const isEdgeGroupNodeType = (nodeType)=>{
    return nodeType === "fan-in" || nodeType === "fan-out" || nodeType === "switch-case";
};
const parseNodeTypeToken = (value)=>{
    const [baseType, preset] = value.split(":");
    return {
        baseType,
        presetKey: preset
    };
};
function createDefaultFanInGroup(id) {
    return {
        id,
        type: "fan-in",
        sources: [],
        target: "",
        edges: []
    };
}
function createDefaultFanOutGroup(id) {
    return {
        id,
        type: "fan-out",
        source: "",
        targets: [],
        edges: [],
        broadcastMode: "parallel"
    };
}
function createDefaultSwitchCaseGroup(id) {
    return {
        id,
        type: "switch-case",
        source: "",
        cases: [],
        switchExpression: "message.type"
    };
}
function createEdgeGroupNode(nodeType, position) {
    const id = `${nodeType}-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])()}`;
    if (nodeType === "fan-in") {
        const group = createDefaultFanInGroup(id);
        const data = {
            variant: "fan-in",
            handles: {
                target: true,
                source: true,
                sourceCount: group.sources.length
            },
            group
        };
        return {
            id,
            type: nodeType,
            position,
            data: data
        };
    }
    if (nodeType === "fan-out") {
        const group = createDefaultFanOutGroup(id);
        const data = {
            variant: "fan-out",
            handles: {
                target: true,
                source: true,
                targetCount: group.targets.length
            },
            group
        };
        return {
            id,
            type: nodeType,
            position,
            data: data
        };
    }
    const group = createDefaultSwitchCaseGroup(id);
    const data = {
        variant: "switch-case",
        handles: {
            target: true,
            source: true,
            caseCount: group.cases.length
        },
        group
    };
    return {
        id,
        type: nodeType,
        position,
        data: data
    };
}
const WorkflowStepNode = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ id, data })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Node"], {
        handles: data.handles,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NodeHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NodeTitle"], {
                        children: data.label
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 368,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NodeDescription"], {
                        children: data.description
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 369,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 367,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NodeContent"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm",
                    children: data.content
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 372,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 371,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NodeFooter"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground text-xs",
                    children: data.footer
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 375,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 374,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toolbar"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$actions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Actions"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$actions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"], {
                            tooltip: "Edit node",
                            label: "Edit",
                            "aria-label": "Edit node",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                className: "size-4"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 380,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 379,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$actions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"], {
                            tooltip: "Delete node",
                            label: "Delete",
                            "aria-label": "Delete node",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                className: "size-4"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 383,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 382,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 378,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 377,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 366,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
const TextBlockWorkflowNode = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ id, data, selected })=>{
    const { handles: _handles, ...cardProps } = data;
    void _handles;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$text$2d$block$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextBlockCard"], {
        ...cardProps,
        "data-id": id,
        isSelected: selected
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 395,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
});
const AttributeWorkflowNode = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ id, data, selected })=>{
    const { handles: _handles, ...attributeProps } = data;
    void _handles;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$attribute$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AttributeNode"], {
        ...attributeProps,
        "data-id": id,
        isSelected: selected
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 404,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
});
const nodeTypes = {
    // Legacy node types (kept for backward compatibility)
    workflow: WorkflowStepNode,
    textBlock: TextBlockWorkflowNode,
    attribute: AttributeWorkflowNode,
    // New executor node types
    executor: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$executors$2f$executor$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExecutorNode"],
    "function-executor": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$executors$2f$function$2d$executor$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FunctionExecutorNode"],
    "agent-executor": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$executors$2f$agent$2d$executor$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AgentExecutorNode"],
    "magentic-agent-executor": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$executors$2f$agent$2d$executor$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AgentExecutorNode"],
    "workflow-executor": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$executors$2f$workflow$2d$executor$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorkflowExecutorNode"],
    "request-info-executor": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$executors$2f$request$2d$info$2d$executor$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RequestInfoExecutorNode"],
    "magentic-orchestrator-executor": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$executors$2f$executor$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExecutorNode"],
    // Edge group node types
    "fan-in": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$edge$2d$groups$2f$fan$2d$in$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FanInNode"],
    "fan-out": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$edge$2d$groups$2f$fan$2d$out$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FanOutNode"],
    "switch-case": __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$edge$2d$groups$2f$switch$2d$case$2d$node$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SwitchCaseNode"]
};
// Create edge types with handlers
const createEdgeTypes = (onEdgeHover)=>({
        animated: (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$edge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatedEdge"], {
                ...props,
                onHover: onEdgeHover ? (pos, screenPos)=>onEdgeHover(props.id, pos, screenPos) : undefined
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 432,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
        temporary: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$edge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TemporaryEdge"]
    });
const edgeTypesBase = {
    animated: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$edge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatedEdge"],
    temporary: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$edge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TemporaryEdge"]
};
const WorkflowCanvas = ()=>{
    const [nodes, setNodes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$xyflow$2b$react$40$12$2e$9$2e$3_$40$types$2b$react$40$19$2e$2$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNodesState"])(initialNodes);
    const [edges, setEdges, onEdgesChange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$xyflow$2b$react$40$12$2e$9$2e$3_$40$types$2b$react$40$19$2e$2$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEdgesState"])(initialEdges);
    const reactFlow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$xyflow$2b$react$40$12$2e$9$2e$3_$40$types$2b$react$40$19$2e$2$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useReactFlow"])();
    const flowWrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // State management for new features
    const [selectedNode, setSelectedNode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [exportDialogOpen, setExportDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [importDialogOpen, setImportDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [locked, setLocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [draggedNodeId, setDraggedNodeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Undo/Redo history management
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        {
            nodes: initialNodes,
            edges: initialEdges
        }
    ]);
    const [historyIndex, setHistoryIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;
    // Save state to history
    const saveToHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newNodes, newEdges)=>{
        setHistory((prev)=>{
            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push({
                nodes: JSON.parse(JSON.stringify(newNodes)),
                edges: JSON.parse(JSON.stringify(newEdges))
            });
            return newHistory.slice(-50) // Keep last 50 states
            ;
        });
        setHistoryIndex((prev)=>Math.min(prev + 1, 49));
    }, [
        historyIndex
    ]);
    // Convert React Flow state to Workflow format
    const currentWorkflow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$conversion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reactFlowToWorkflow"])(nodes, edges, "workflow-1", "Agentic Fabric");
    }, [
        nodes,
        edges
    ]);
    // Handle node selection - wrapper to sync selected node state
    const handleNodesChangeWrapper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((changes)=>{
        const nextNodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$xyflow$2b$react$40$12$2e$9$2e$3_$40$types$2b$react$40$19$2e$2$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["applyNodeChanges"])(changes, nodes);
        setNodes(nextNodes);
        const significantChanges = changes.filter((change)=>change.type !== "select" && change.type !== "position");
        if (significantChanges.length > 0 && !draggedNodeId) {
            saveToHistory(nextNodes, edges);
        }
        if (selectedNode) {
            const updated = nextNodes.find((node)=>node.id === selectedNode.id);
            setSelectedNode(updated ? updated : null);
        }
    }, [
        nodes,
        selectedNode,
        setNodes,
        edges,
        saveToHistory,
        draggedNodeId
    ]);
    const handleConnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((connection)=>{
        setEdges((eds)=>{
            const newEdges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$xyflow$2b$system$40$0$2e$0$2e$73$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addEdge"])({
                ...connection,
                type: "animated"
            }, eds);
            saveToHistory(nodes, newEdges);
            return newEdges;
        });
    }, [
        setEdges,
        nodes,
        saveToHistory
    ]);
    // Handle inserting node on edge
    const [edgeDropdownState, setEdgeDropdownState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleEdgeHover = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((edgeId, position, screenPosition)=>{
        setEdgeDropdownState({
            edgeId,
            position,
            screenPosition
        });
    }, []);
    const handleInsertNodeOnEdge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((nodeType)=>{
        if (!edgeDropdownState) return;
        const edge = edges.find((e)=>e.id === edgeDropdownState.edgeId);
        if (!edge) {
            setEdgeDropdownState(null);
            return;
        }
        const position = edgeDropdownState.position;
        const { baseType, presetKey } = parseNodeTypeToken(nodeType);
        // Create new node
        setNodes((nds)=>{
            let newNode;
            if (isEdgeGroupNodeType(baseType)) {
                newNode = createEdgeGroupNode(baseType, position);
            } else {
                const executorId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
                const preset = presetKey ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$magentic$2d$presets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAGENTIC_AGENT_PRESETS"].find((item)=>item.key === presetKey) : undefined;
                const executor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$conversion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createExecutorFromNodeType"])(baseType, executorId, preset?.label || `New ${baseType}`, {
                    presetKey
                });
                const nodeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$conversion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createNodeDataFromExecutorType"])(baseType, executor);
                newNode = {
                    id: executorId,
                    type: baseType,
                    position,
                    data: {
                        ...nodeData,
                        ...{}
                    }
                };
            }
            const newNodes = [
                ...nds,
                newNode
            ];
            // Split edge: remove old edge, add two new edges
            setEdges((eds)=>{
                const filtered = eds.filter((e)=>e.id !== edgeDropdownState.edgeId);
                const newEdges = [
                    ...filtered,
                    {
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                        source: edge.source,
                        target: newNode.id,
                        type: "animated"
                    },
                    {
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                        source: newNode.id,
                        target: edge.target,
                        type: "animated"
                    }
                ];
                // Save to history after all changes
                saveToHistory(newNodes, newEdges);
                return newEdges;
            });
            return newNodes;
        });
        setEdgeDropdownState(null);
    }, [
        edgeDropdownState,
        edges,
        setNodes,
        setEdges,
        saveToHistory
    ]);
    const handleDragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        event.preventDefault();
        const nodeType = event.dataTransfer.getData("application/reactflow");
        if (!nodeType) {
            return;
        }
        const position = reactFlow.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY
        });
        setNodes((nds)=>{
            let newNode;
            const { baseType, presetKey } = parseNodeTypeToken(nodeType);
            if (baseType === "textBlock") {
                newNode = {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    type: baseType,
                    position,
                    data: {
                        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultTextBlockData"])(),
                        ...{}
                    }
                };
            } else if (baseType === "attribute") {
                newNode = {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    type: baseType,
                    position,
                    data: {
                        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultAttributeNodeData"])(),
                        ...{}
                    }
                };
            } else if (baseType === "workflow") {
                newNode = {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    type: baseType,
                    position,
                    data: {
                        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultWorkflowStepData"])({
                            label: `New Step ${nds.length + 1}`
                        }),
                        ...{}
                    }
                };
            } else if (isEdgeGroupNodeType(baseType)) {
                newNode = createEdgeGroupNode(baseType, position);
            } else {
                const executorId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
                const preset = presetKey ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$magentic$2d$presets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAGENTIC_AGENT_PRESETS"].find((item)=>item.key === presetKey) : undefined;
                const executor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$conversion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createExecutorFromNodeType"])(baseType, executorId, preset?.label || `New ${baseType}`, {
                    presetKey
                });
                const nodeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$conversion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createNodeDataFromExecutorType"])(baseType, executor);
                newNode = {
                    id: executorId,
                    type: baseType,
                    position,
                    data: {
                        ...nodeData,
                        ...{}
                    }
                };
            }
            const newNodes = [
                ...nds,
                newNode
            ];
            saveToHistory(newNodes, edges);
            return newNodes;
        });
    }, [
        reactFlow,
        setNodes,
        edges,
        saveToHistory
    ]);
    const handleDragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event, nodeType)=>{
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    }, []);
    const handleAddNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((nodeType = "executor")=>{
        if (!flowWrapperRef.current) {
            return;
        }
        const bounds = flowWrapperRef.current.getBoundingClientRect();
        const centerPosition = reactFlow.screenToFlowPosition({
            x: bounds.left + bounds.width / 2,
            y: bounds.top + bounds.height / 2
        });
        setNodes((nds)=>{
            let newNode;
            const { baseType, presetKey } = parseNodeTypeToken(nodeType);
            if (baseType === "workflow") {
                newNode = {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    type: baseType,
                    position: centerPosition,
                    data: {
                        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultWorkflowStepData"])({
                            label: `New Step ${nds.length + 1}`,
                            description: "Added from panel",
                            content: "Start connecting this step to build out the workflow."
                        }),
                        ...{}
                    }
                };
            } else if (isEdgeGroupNodeType(baseType)) {
                newNode = createEdgeGroupNode(baseType, centerPosition);
            } else {
                const executorId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
                const preset = presetKey ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$magentic$2d$presets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAGENTIC_AGENT_PRESETS"].find((item)=>item.key === presetKey) : undefined;
                const executor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$conversion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createExecutorFromNodeType"])(baseType, executorId, preset?.label || `New ${baseType}`, {
                    presetKey
                });
                const nodeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$conversion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createNodeDataFromExecutorType"])(baseType, executor);
                newNode = {
                    id: executorId,
                    type: baseType,
                    position: centerPosition,
                    data: {
                        ...nodeData,
                        ...{}
                    }
                };
            }
            const newNodes = [
                ...nds,
                newNode
            ];
            saveToHistory(newNodes, edges);
            return newNodes;
        });
    }, [
        reactFlow,
        setNodes,
        edges,
        saveToHistory
    ]);
    const handleAddMagenticScaffold = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!flowWrapperRef.current) {
            return;
        }
        const bounds = flowWrapperRef.current.getBoundingClientRect();
        const centerPosition = reactFlow.screenToFlowPosition({
            x: bounds.left + bounds.width / 2,
            y: bounds.top + bounds.height / 2
        });
        const currentNodes = reactFlow.getNodes();
        const currentEdges = reactFlow.getEdges();
        const findPresetKey = (node)=>{
            const executor = node.data?.executor;
            const metadata = executor?.metadata?.magentic;
            return metadata?.presetKey ?? metadata?.preset ?? undefined;
        };
        let orchestratorNode = currentNodes.find((node)=>node.type === "magentic-orchestrator-executor");
        if (!orchestratorNode) {
            const orchestratorId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
            const orchestratorExecutor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$conversion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createExecutorFromNodeType"])("magentic-orchestrator-executor", orchestratorId, "Magentic Orchestrator");
            orchestratorNode = {
                id: orchestratorId,
                type: "magentic-orchestrator-executor",
                position: centerPosition,
                data: {
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$conversion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createNodeDataFromExecutorType"])("magentic-orchestrator-executor", orchestratorExecutor)
                }
            };
        }
        const orchestratorId = orchestratorNode.id;
        const origin = orchestratorNode.position ?? centerPosition;
        const radius = 280;
        const presets = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$magentic$2d$presets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAGENTIC_AGENT_PRESETS"];
        const angleStep = presets.length ? Math.PI * 2 / presets.length : 0;
        const nextNodesMap = new Map();
        currentNodes.forEach((node)=>nextNodesMap.set(node.id, {
                ...node
            }));
        nextNodesMap.set(orchestratorNode.id, {
            ...orchestratorNode,
            position: origin
        });
        const agentNodes = presets.map((preset, index)=>{
            const angle = angleStep * index;
            const targetPosition = {
                x: origin.x + radius * Math.cos(angle),
                y: origin.y + radius * Math.sin(angle)
            };
            const existing = [
                ...nextNodesMap.values()
            ].find((node)=>node.type === "magentic-agent-executor" && findPresetKey(node) === preset.key);
            if (existing) {
                const executor = existing.data?.executor;
                const updatedExecutor = executor ? {
                    ...executor,
                    metadata: {
                        ...executor.metadata || {},
                        magentic: {
                            presetKey: preset.key,
                            capabilities: preset.capabilities
                        },
                        source: "agent-framework"
                    },
                    capabilities: preset.capabilities,
                    systemPrompt: preset.systemPrompt,
                    label: preset.label,
                    description: preset.description,
                    tools: preset.toolIds?.map((toolId)=>({
                            toolId,
                            enabled: true
                        }))
                } : undefined;
                const updatedNode = {
                    ...existing,
                    position: targetPosition,
                    data: {
                        ...existing.data,
                        executor: updatedExecutor ?? existing.data.executor,
                        label: preset.label,
                        description: preset.description
                    }
                };
                nextNodesMap.set(updatedNode.id, updatedNode);
                return updatedNode;
            }
            const agentId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
            const agentExecutor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$conversion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createExecutorFromNodeType"])("magentic-agent-executor", agentId, preset.label, {
                presetKey: preset.key
            });
            const newNode = {
                id: agentId,
                type: "magentic-agent-executor",
                position: targetPosition,
                data: {
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$conversion$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createNodeDataFromExecutorType"])("magentic-agent-executor", agentExecutor)
                }
            };
            nextNodesMap.set(agentId, newNode);
            return newNode;
        });
        const nextEdges = [
            ...currentEdges
        ];
        const ensureEdge = (source, target)=>{
            if (!nextEdges.some((edge)=>edge.source === source && edge.target === target)) {
                nextEdges.push({
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    source,
                    target,
                    type: "animated"
                });
            }
        };
        agentNodes.forEach((agentNode)=>{
            ensureEdge(orchestratorId, agentNode.id);
            ensureEdge(agentNode.id, orchestratorId);
        });
        setNodes(Array.from(nextNodesMap.values()));
        setEdges(nextEdges);
    }, [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workflow$2f$magentic$2d$presets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAGENTIC_AGENT_PRESETS"],
        reactFlow,
        setEdges,
        setNodes
    ]);
    // Handle node update from properties panel
    const handleNodeUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((nodeId, updates)=>{
        let updatedNode = null;
        setNodes((nds)=>nds.map((node)=>{
                if (node.id === nodeId && isExecutorNode(node)) {
                    const currentData = node.data;
                    if (currentData.executor) {
                        const updatedExecutor = {
                            ...currentData.executor,
                            ...updates
                        };
                        const nextNode = {
                            ...node,
                            data: {
                                ...currentData,
                                executor: updatedExecutor,
                                label: updates.label ?? currentData.label,
                                description: updates.description ?? currentData.description
                            }
                        };
                        updatedNode = nextNode;
                        return nextNode;
                    }
                }
                return node;
            }));
        if (selectedNode?.id === nodeId) {
            setSelectedNode(updatedNode ?? null);
        }
    }, [
        setNodes,
        selectedNode
    ]);
    // Check if node is an executor node
    const isExecutorNode = (node)=>{
        const data = node.data;
        return data?.variant === "executor" || data?.variant === "function-executor" || data?.variant === "agent-executor" || data?.variant === "workflow-executor" || data?.variant === "request-info-executor";
    };
    // Handle node selection
    const handleNodeClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((_event, node)=>{
        setSelectedNode(node);
    }, []);
    // Handle workflow import
    const handleImport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((importedNodes, importedEdges)=>{
        setNodes(importedNodes);
        setEdges(importedEdges);
        reactFlow.fitView();
    }, [
        setNodes,
        setEdges,
        reactFlow
    ]);
    const handleEvaluate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // TODO: Implement evaluate functionality
        console.log("Evaluate workflow");
    }, []);
    const handleCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // TODO: Implement code view functionality
        console.log("Show code");
    }, []);
    const handlePreview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // TODO: Implement preview functionality
        console.log("Preview workflow");
    }, []);
    const handlePublish = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // TODO: Implement publish functionality
        console.log("Publish workflow");
    }, []);
    const handleNodeDragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((_event, node)=>{
        setDraggedNodeId(node.id);
    }, []);
    const handleNodeDragStop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((_event, node)=>{
        if (!draggedNodeId) return;
        // Find if the dragged node overlaps with any other node
        const draggedNode = nodes.find((n)=>n.id === draggedNodeId);
        if (!draggedNode) {
            setDraggedNodeId(null);
            return;
        }
        // Check for overlapping nodes (excluding the dragged node itself)
        const overlappingNode = nodes.find((n)=>{
            if (n.id === draggedNodeId) return false;
            // Calculate node bounds (assuming standard node dimensions)
            const nodeWidth = 300;
            const nodeHeight = 200;
            const draggedBounds = {
                left: draggedNode.position.x,
                right: draggedNode.position.x + nodeWidth,
                top: draggedNode.position.y,
                bottom: draggedNode.position.y + nodeHeight
            };
            const targetBounds = {
                left: n.position.x,
                right: n.position.x + nodeWidth,
                top: n.position.y,
                bottom: n.position.y + nodeHeight
            };
            // Check for overlap
            return !(draggedBounds.right < targetBounds.left || draggedBounds.left > targetBounds.right || draggedBounds.bottom < targetBounds.top || draggedBounds.top > targetBounds.bottom);
        });
        if (overlappingNode) {
            // Reposition the dragged node near the overlapping node
            const offset = 350 // Distance to place the node
            ;
            const angle = Math.atan2(draggedNode.position.y - overlappingNode.position.y, draggedNode.position.x - overlappingNode.position.x);
            const newPosition = {
                x: overlappingNode.position.x + Math.cos(angle) * offset,
                y: overlappingNode.position.y + Math.sin(angle) * offset
            };
            setNodes((nds)=>{
                const updatedNodes = nds.map((n)=>n.id === draggedNodeId ? {
                        ...n,
                        position: newPosition
                    } : n);
                saveToHistory(updatedNodes, edges);
                return updatedNodes;
            });
        } else {
            // Save position change to history even if no overlap
            saveToHistory(nodes, edges);
        }
        setDraggedNodeId(null);
    }, [
        draggedNodeId,
        nodes,
        edges,
        setNodes,
        saveToHistory
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-full w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$top$2d$navigation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TopNavigation"], {
                projectName: currentWorkflow.name || "MCP Draft",
                projectStatus: currentWorkflow.metadata?.custom?.status,
                workflow: currentWorkflow,
                onEvaluate: handleEvaluate,
                onCode: handleCode,
                onPreview: handlePreview,
                onPublish: handlePublish,
                onValidate: ()=>{
                    // TODO: Implement validation view/panel
                    console.log("Validate workflow");
                }
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1016,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: flowWrapperRef,
                className: "absolute inset-0 w-full h-full overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$canvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Canvas"], {
                        className: "h-full w-full",
                        connectionLineComponent: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$elements$2f$connection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Connection"],
                        edges: edges,
                        fitView: true,
                        nodes: nodes,
                        nodeTypes: nodeTypes,
                        onConnect: handleConnect,
                        onDragOver: handleDragOver,
                        onDrop: handleDrop,
                        onEdgesChange: onEdgesChange,
                        onNodesChange: handleNodesChangeWrapper,
                        onNodeClick: handleNodeClick,
                        onPaneClick: ()=>{
                            setSelectedNode(null);
                            setEdgeDropdownState(null);
                        },
                        panOnDrag: [
                            1
                        ],
                        nodesDraggable: !locked,
                        selectionOnDrag: false,
                        edgeTypes: createEdgeTypes(handleEdgeHover),
                        onNodeDragStart: handleNodeDragStart,
                        onNodeDragStop: handleNodeDragStop,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$node$2d$library$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NodeLibrary"], {
                                onAddNode: handleAddNode,
                                onDragStart: handleDragStart,
                                onAddMagenticScaffold: handleAddMagenticScaffold
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1054,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            edgeDropdownState && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$edge$2d$node$2d$dropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EdgeNodeDropdown"], {
                                edgeId: edgeDropdownState.edgeId,
                                position: edgeDropdownState.position,
                                screenPosition: edgeDropdownState.screenPosition,
                                onSelectNode: handleInsertNodeOnEdge,
                                onClose: ()=>setEdgeDropdownState(null)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1060,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            selectedNode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$properties$2d$panel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PropertiesPanel"], {
                                selectedNode: {
                                    id: selectedNode.id,
                                    type: selectedNode.type || "executor",
                                    data: selectedNode.data
                                },
                                onUpdate: (nodeId, updates)=>{
                                    if (locked) return;
                                    handleNodeUpdate(nodeId, updates);
                                },
                                onDelete: (nodeId)=>{
                                    if (locked) return;
                                    setNodes((nds)=>{
                                        const newNodes = nds.filter((n)=>n.id !== nodeId);
                                        saveToHistory(newNodes, edges);
                                        return newNodes;
                                    });
                                    if (selectedNode?.id === nodeId) {
                                        setSelectedNode(null);
                                    }
                                },
                                onDuplicate: (nodeId)=>{
                                    if (locked) return;
                                    const nodeToDuplicate = nodes.find((n)=>n.id === nodeId);
                                    if (nodeToDuplicate) {
                                        const newId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])();
                                        const duplicatedNode = {
                                            ...nodeToDuplicate,
                                            id: newId,
                                            position: {
                                                x: nodeToDuplicate.position.x + 50,
                                                y: nodeToDuplicate.position.y + 50
                                            }
                                        };
                                        setNodes((nds)=>{
                                            const newNodes = [
                                                ...nds,
                                                duplicatedNode
                                            ];
                                            saveToHistory(newNodes, edges);
                                            return newNodes;
                                        });
                                    }
                                },
                                onEvaluate: (nodeId)=>{
                                    // TODO: Implement node evaluation
                                    console.log("Evaluate node", nodeId);
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1069,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$bottom$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BottomControls"], {
                                onUndo: ()=>{
                                    if (canUndo) {
                                        const newIndex = historyIndex - 1;
                                        setHistoryIndex(newIndex);
                                        const state = history[newIndex];
                                        setNodes(state.nodes);
                                        setEdges(state.edges);
                                    }
                                },
                                onRedo: ()=>{
                                    if (canRedo) {
                                        const newIndex = historyIndex + 1;
                                        setHistoryIndex(newIndex);
                                        const state = history[newIndex];
                                        setNodes(state.nodes);
                                        setEdges(state.edges);
                                    }
                                },
                                canUndo: canUndo,
                                canRedo: canRedo,
                                onFitView: ()=>{
                                    try {
                                        reactFlow.fitView();
                                    } catch  {}
                                },
                                locked: locked,
                                onToggleLock: ()=>setLocked((v)=>!v)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 1116,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1030,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$export$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExportDialog"], {
                        open: exportDialogOpen,
                        onOpenChange: setExportDialogOpen,
                        workflow: currentWorkflow
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1146,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workflow$2d$builder$2f$import$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ImportDialog"], {
                        open: importDialogOpen,
                        onOpenChange: setImportDialogOpen,
                        onImport: handleImport
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 1147,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1029,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 1015,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Component {
    constructor(props){
        super(props);
        this.state = {
            hasError: false
        };
    }
    static getDerivedStateFromError() {
        return {
            hasError: true
        };
    }
    componentDidCatch() {}
    render() {
        if (this.state.hasError) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 text-sm",
                children: "Something went wrong."
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1167,
                columnNumber: 14
            }, this);
        }
        return this.props.children;
    }
}
const Page = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$xyflow$2b$react$40$12$2e$9$2e$3_$40$types$2b$react$40$19$2e$2$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ReactFlowProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-screen w-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorBoundary, {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$0_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkflowCanvas, {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 1177,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 1176,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 1175,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 1174,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const __TURBOPACK__default__export__ = Page;
}),
];

//# sourceMappingURL=_766107a7._.js.map