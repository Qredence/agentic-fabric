"use client"

import { useState, useRef, useCallback } from "react"
import { Panel } from "@/components/ai-elements/panel"
import { Label } from "@/components/ui/label"
import { useAgentConfigStore } from "@/components/providers/config-provider"
import type { AgentConfig } from "@/lib/config/agent-config"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Trash2, ExternalLink, ChevronDown, ChevronUp, Pencil, Plus, BookOpen, Info, Cog } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BaseExecutor } from "@/lib/workflow/types"
import type {
  FunctionExecutor,
  AgentExecutor,
  WorkflowExecutor,
  RequestInfoExecutor,
  MagenticAgentExecutor,
  MagenticOrchestratorExecutor,
} from "@/lib/workflow/executors"
import { FunctionExecutorEditor } from "./executor-editors/function-executor-editor"
import { AgentExecutorEditor } from "./executor-editors/agent-executor-editor"
import { WorkflowExecutorEditor } from "./executor-editors/workflow-executor-editor"
import { RequestInfoExecutorEditor } from "./executor-editors/request-info-executor-editor"
import { MagenticAgentExecutorEditor } from "./executor-editors/magentic-agent-executor-editor"
import { MagenticOrchestratorExecutorEditor } from "./executor-editors/magentic-orchestrator-executor-editor"

interface PropertiesPanelProps {
  selectedNode: {
    id: string
    type: string
    data: {
      executor?: BaseExecutor
      executorType?: string
      label?: string
      description?: string
    }
  } | null
  onUpdate: (nodeId: string, updates: Partial<BaseExecutor>) => void
  onDelete?: (nodeId: string) => void
  onDuplicate?: (nodeId: string) => void
  onEvaluate?: (nodeId: string) => void
}

export function PropertiesPanel({ selectedNode, onUpdate, onDelete, onDuplicate, onEvaluate }: PropertiesPanelProps) {
  const { get, set } = useAgentConfigStore()
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [includeChatHistory, setIncludeChatHistory] = useState(true)
  const [verbosity, setVerbosity] = useState("medium")
  const [summary, setSummary] = useState("auto")
  const [continueOnError, setContinueOnError] = useState(false)
  const [writeToConversationHistory, setWriteToConversationHistory] = useState(true)
  const instructionsDebounceRef = useRef<number | null>(null)

  if (!selectedNode || !selectedNode.data.executor) {
    return (
      <Panel
        position="center-right"
        className="mr-4 w-[min(100%,480px)] p-0"
        role="region"
        aria-label="Properties Panel"
      >
        <div className="text-sm text-muted-foreground text-center py-8">
          Select a node to view and edit its properties
        </div>
      </Panel>
    )
  }

  const executor = selectedNode.data.executor
  const currentCfg: AgentConfig | undefined = get(selectedNode.id)
  const executorType = selectedNode.data.executorType || executor.type
  const nodeLabel = selectedNode.data.label || executor.label || executor.id
  const nodeDescription = selectedNode.data.description || executor.description || "Configure the executor settings"
  const showGuardrails = true

  const handleChange = (field: keyof BaseExecutor, value: unknown) => {
    onUpdate(selectedNode.id, { [field]: value } as Partial<BaseExecutor>)
  }

  const handleExecutorChange = (updates: Partial<BaseExecutor>) => {
    onUpdate(selectedNode.id, updates)
  }

  const handleNameChange = (value: string) => {
    onUpdate(selectedNode.id, { label: value } as Partial<BaseExecutor>)
  }

  const handleInstructionsChange = (value: string) => {
    const agentExecutor = executor as AgentExecutor
    // Check executorType instead of checking if systemPrompt property exists
    // This handles both preset-based and newly created agent executors
    if (executorType === "agent-executor" || executorType === "magentic-agent-executor") {
      onUpdate(selectedNode.id, {
        systemPrompt: value,
      } as Partial<BaseExecutor>)
    } else if (executorType === "magentic-orchestrator-executor") {
      // For orchestrator, instructions might be stored differently
      handleChange("description" as keyof BaseExecutor, value)
    }
  }

  const getInstructionsValue = (): string => {
    const agentExecutor = executor as AgentExecutor
    return (
      (agentExecutor as any).systemPrompt ||
      (agentExecutor as any).instructions ||
      executor.description ||
      "You are a helpful assistant."
    )
  }

  return (
    <Panel
      position="center-right"
      className={cn(
        "mr-4 sm:w-full md:w-[min(100%,480px)] p-0",
        "max-h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col"
      )}
      role="region"
      aria-labelledby={`panel-title-${selectedNode.id}`}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {/* Header Section */}
        <div className="space-y-1 border-b border-border bg-secondary rounded-t-md px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 id={`panel-title-${selectedNode.id}`} className="text-lg font-semibold text-foreground truncate">
                {nodeLabel}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">{nodeDescription}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors duration-200 ease-out"
                title="Documentation"
              >
                <BookOpen className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors duration-200 ease-out"
                onClick={() => onDelete?.(selectedNode.id)}
                title="Delete node"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Name Field - Horizontal Layout */}
        <div className="flex items-center gap-3">
          <Label htmlFor="node-name" className="text-sm font-normal whitespace-nowrap">
            Name
          </Label>
          <Input
            id="node-name"
            value={nodeLabel}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter node name"
            className="flex-1"
          />
        </div>

        {/* Input Pill */}
        <div className="flex items-center gap-3">
          <Label htmlFor="guardrails-input" className="text-sm font-normal whitespace-nowrap">
            Input
          </Label>
          <div className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-1 h-[34px] min-w-[140px] w-full">
            <div className="flex items-center gap-2 pr-2 w-full">
              <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0">
                <BookOpen className="h-4 w-4" />
              </Button>
              <span id="guardrails-input" className="text-sm text-foreground truncate flex-1">
                {currentCfg?.guardrails?.inputField || "input_as_text"}
              </span>
              <span className="inline-flex items-center justify-center rounded-md bg-background px-1.5 py-0.5 text-[10px] font-medium tracking-[0.5px] text-foreground">
                STRING
              </span>
            </div>
          </div>
        </div>

        {/* Instructions Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="node-instructions">Instructions</Label>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Textarea
            id="node-instructions"
            defaultValue={currentCfg?.prompt?.system || getInstructionsValue()}
            onChange={(e) => {
              if (instructionsDebounceRef.current) window.clearTimeout(instructionsDebounceRef.current)
              const val = e.target.value
              instructionsDebounceRef.current = window.setTimeout(() => {
                const next = set(selectedNode.id, { prompt: { ...(currentCfg?.prompt || {}), system: val } })
                onUpdate(selectedNode.id, { systemPrompt: next.prompt?.system } as Partial<BaseExecutor>)
              }, 250)
            }}
            placeholder="You are a helpful assistant."
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Configuration Options */}
        <div className="space-y-3">
          {/* Include chat history toggle */}
          <div className="flex items-center justify-between h-[34px]">
            <Label htmlFor="chat-history" className="text-sm font-normal">
              Include chat history
            </Label>
            <div className="flex items-center h-[34px]">
              <Switch checked={includeChatHistory} onCheckedChange={setIncludeChatHistory} />
            </div>
          </div>

          {/* Model dropdown */}
          <div className="flex items-center justify-between h-[34px]">
            <Label htmlFor="model-select" className="text-sm font-normal">
              Model
            </Label>
            <Select
              defaultValue={currentCfg?.model?.model || (executor as AgentExecutor).model || "gpt-5"}
              onValueChange={(value) => {
                const next = set(selectedNode.id, { model: { ...(currentCfg?.model || {}), model: value } })
                onUpdate(selectedNode.id, { model: next.model?.model } as Partial<BaseExecutor>)
              }}
            >
              <SelectTrigger id="model-select" className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-5">GPT-5</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reasoning effort dropdown */}
          <div className="flex items-center justify-between h-[34px]">
            <Label htmlFor="reasoning-effort-select" className="text-sm font-normal">
              Reasoning effort
            </Label>
            <Select defaultValue="low">
              <SelectTrigger id="reasoning-effort-select" className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tools field */}
          <div className="flex items-center justify-between h-[34px]">
            <Label htmlFor="tools" className="text-sm font-normal">
              Tools
            </Label>
            <div className="flex items-center gap-2 h-[34px]">
              <div className="px-3 h-[34px] flex items-center rounded-md border bg-muted/50 text-sm text-muted-foreground min-w-[140px] text-right">
                {Array.isArray((executor as AgentExecutor).tools) && ((executor as AgentExecutor).tools?.length ?? 0) > 0
                  ? `${(executor as AgentExecutor).tools?.length ?? 0} tool(s) configured`
                  : "No tools configured"}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Output format dropdown */}
          <div className="flex items-center justify-between h-[34px]">
            <Label htmlFor="output-format-select" className="text-sm font-normal">
              Output format
            </Label>
            <Select defaultValue="text">
              <SelectTrigger id="output-format-select" className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Guardrails Section */}
        {showGuardrails && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Guardrails</h3>
          </div>

          {/* PII */}
          <div className="flex items-center justify-between h-[34px]">
            <div className="inline-flex items-center gap-2">
              <Label id="pii-label" htmlFor="pii" className="text-sm font-normal">Personally identifiable information</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Info" className="h-6 w-6"><Info className="h-3 w-3" /></Button>
                </TooltipTrigger>
                <TooltipContent>Detects and redacts personally identifiable information</TooltipContent>
              </Tooltip>
              <Button variant="ghost" size="icon" aria-label="Settings" className="h-6 w-6"><Cog className="h-3 w-3" /></Button>
            </div>
            <div className="flex items-center h-[34px]">
              <Switch
                aria-labelledby="pii-label"
                id="pii"
                checked={!!currentCfg?.guardrails?.pii}
                onCheckedChange={(checked) => {
                  const next = set(selectedNode.id, { guardrails: { ...(currentCfg?.guardrails || {}), pii: checked } })
                  onUpdate(selectedNode.id, { guardrails: next.guardrails } as Partial<BaseExecutor>)
                }}
              />
            </div>
          </div>

          {/* Moderation */}
          <div className="flex items-center justify-between h-[34px]">
            <div className="inline-flex items-center gap-2">
              <Label id="moderation-label" htmlFor="moderation" className="text-sm font-normal">Moderation</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Info" className="h-6 w-6"><Info className="h-3 w-3" /></Button>
                </TooltipTrigger>
                <TooltipContent>Flags unsafe or disallowed content</TooltipContent>
              </Tooltip>
              <Button variant="ghost" size="icon" aria-label="Settings" className="h-6 w-6"><Cog className="h-3 w-3" /></Button>
            </div>
            <div className="flex items-center h-[34px]">
              <Switch
                aria-labelledby="moderation-label"
                id="moderation"
                checked={!!currentCfg?.guardrails?.moderation}
                onCheckedChange={(checked) => {
                  const next = set(selectedNode.id, { guardrails: { ...(currentCfg?.guardrails || {}), moderation: checked } })
                  onUpdate(selectedNode.id, { guardrails: next.guardrails } as Partial<BaseExecutor>)
                }}
              />
            </div>
          </div>

          {/* Jailbreak */}
          <div className="flex items-center justify-between h-[34px]">
            <div className="inline-flex items-center gap-2">
              <Label id="jailbreak-label" htmlFor="jailbreak" className="text-sm font-normal">Jailbreak</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Info" className="h-6 w-6"><Info className="h-3 w-3" /></Button>
                </TooltipTrigger>
                <TooltipContent>Detects attempts to bypass safety guardrails</TooltipContent>
              </Tooltip>
              <Button variant="ghost" size="icon" aria-label="Settings" className="h-6 w-6"><Cog className="h-3 w-3" /></Button>
            </div>
            <div className="flex items-center h-[34px]">
              <Switch
                aria-labelledby="jailbreak-label"
                id="jailbreak"
                checked={!!currentCfg?.guardrails?.jailbreak}
                onCheckedChange={(checked) => {
                  const next = set(selectedNode.id, { guardrails: { ...(currentCfg?.guardrails || {}), jailbreak: checked } })
                  onUpdate(selectedNode.id, { guardrails: next.guardrails } as Partial<BaseExecutor>)
                }}
              />
            </div>
          </div>

          {/* Hallucination */}
          <div className="flex items-center justify-between h-[34px]">
            <div className="inline-flex items-center gap-2">
              <Label id="hallucination-label" htmlFor="hallucination" className="text-sm font-normal">Hallucination</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Info" className="h-6 w-6"><Info className="h-3 w-3" /></Button>
                </TooltipTrigger>
                <TooltipContent>Attempts to detect likely hallucinations</TooltipContent>
              </Tooltip>
              <Button variant="ghost" size="icon" aria-label="Settings" className="h-6 w-6"><Cog className="h-3 w-3" /></Button>
            </div>
            <div className="flex items-center h-[34px]">
              <Switch
                aria-labelledby="hallucination-label"
                id="hallucination"
                checked={!!currentCfg?.guardrails?.hallucination}
                onCheckedChange={(checked) => {
                  const next = set(selectedNode.id, { guardrails: { ...(currentCfg?.guardrails || {}), hallucination: checked } })
                  onUpdate(selectedNode.id, { guardrails: next.guardrails } as Partial<BaseExecutor>)
                }}
              />
            </div>
          </div>

          {/* Continue on error */}
          <div className="flex items-center justify-between h-[34px]">
            <div className="inline-flex items-center gap-2">
              <Label id="continue-label" htmlFor="continue-on-error" className="text-sm font-normal">Continue on error</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Info" className="h-6 w-6"><Info className="h-3 w-3" /></Button>
                </TooltipTrigger>
                <TooltipContent>Proceed even if a guardrail fails</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center h-[34px]">
              <Switch
                aria-labelledby="continue-label"
                id="continue-on-error"
                checked={!!currentCfg?.guardrails?.continueOnError}
                onCheckedChange={(checked) => {
                  const next = set(selectedNode.id, { guardrails: { ...(currentCfg?.guardrails || {}), continueOnError: checked } })
                  onUpdate(selectedNode.id, { guardrails: next.guardrails } as Partial<BaseExecutor>)
                }}
              />
            </div>
          </div>
        </div>
        )}

        {/* Model Parameters Section */}
        <div className="space-y-3 pt-2 border-t border-border">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Model parameters</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between h-[34px]">
              <Label htmlFor="verbosity-select" className="text-sm font-normal">
                Verbosity
              </Label>
              <Select value={verbosity} onValueChange={setVerbosity}>
                <SelectTrigger id="verbosity-select" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label htmlFor="temperature" className="text-sm font-normal">Temperature</Label>
                <Input id="temperature" type="number" step="0.05" defaultValue={currentCfg?.model?.temperature ?? 0.7} onChange={(e) => {
                  const v = Number(e.target.value)
                  const next = set(selectedNode.id, { model: { ...(currentCfg?.model || {}), temperature: v } })
                  onUpdate(selectedNode.id, { temperature: next.model?.temperature } as Partial<BaseExecutor>)
                }} />
              </div>
              <div className="flex-1">
                <Label htmlFor="maxTokens" className="text-sm font-normal">Max tokens</Label>
                <Input id="maxTokens" type="number" defaultValue={currentCfg?.model?.maxTokens ?? 1024} onChange={(e) => {
                  const v = Number(e.target.value)
                  const next = set(selectedNode.id, { model: { ...(currentCfg?.model || {}), maxTokens: v } })
                  onUpdate(selectedNode.id, { maxTokens: next.model?.maxTokens } as Partial<BaseExecutor>)
                }} />
              </div>
            </div>
            <div className="flex items-center justify-between h-[34px]">
              <Label htmlFor="summary-select" className="text-sm font-normal">
                Summary
              </Label>
              <Select value={summary} onValueChange={setSummary}>
                <SelectTrigger id="summary-select" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="always">Always</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>


        {/* Advanced Section */}
        <div className="space-y-3 pt-2 border-t border-border">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Advanced</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between h-[34px]">
              <Label htmlFor="continue-error" className="text-sm font-normal">
                Continue on error
              </Label>
              <div className="flex items-center h-[34px]">
                <Switch checked={continueOnError} onCheckedChange={setContinueOnError} />
              </div>
            </div>
            <div className="flex items-center justify-between h-[34px]">
              <Label htmlFor="write-history" className="text-sm font-normal">
                Write to conversation history
              </Label>
              <div className="flex items-center h-[34px]">
                <Switch checked={writeToConversationHistory} onCheckedChange={setWriteToConversationHistory} />
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Advanced Configuration Section */}
        <Collapsible open={isMoreOpen} onOpenChange={setIsMoreOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <span>{isMoreOpen ? "Less" : "More"}</span>
            {isMoreOpen ? (
              <ChevronUp className="h-4 w-4 transition-transform" />
            ) : (
              <ChevronDown className="h-4 w-4 transition-transform" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div className="space-y-2">
              <Label htmlFor="executor-id">Executor ID</Label>
              <Input id="executor-id" value={executor.id} disabled className="font-mono text-xs bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="executor-type">Type</Label>
              <Input id="executor-type" value={executorType} disabled className="font-mono text-xs bg-muted" />
            </div>
            {/* Type-specific editors */}
            {executorType === "function-executor" && (
              <FunctionExecutorEditor executor={executor as FunctionExecutor} onChange={handleExecutorChange} />
            )}

            {executorType === "agent-executor" && (
              <AgentExecutorEditor executor={executor as AgentExecutor} onChange={handleExecutorChange} />
            )}

            {executorType === "magentic-agent-executor" && (
              <MagenticAgentExecutorEditor
                executor={executor as MagenticAgentExecutor}
                onChange={handleExecutorChange as (updates: Partial<MagenticAgentExecutor>) => void}
              />
            )}

            {executorType === "workflow-executor" && (
              <WorkflowExecutorEditor executor={executor as WorkflowExecutor} onChange={handleExecutorChange} />
            )}

            {executorType === "request-info-executor" && (
              <RequestInfoExecutorEditor executor={executor as RequestInfoExecutor} onChange={handleExecutorChange} />
            )}

            {executorType === "magentic-orchestrator-executor" && (
              <MagenticOrchestratorExecutorEditor
                executor={executor as MagenticOrchestratorExecutor}
                onChange={handleExecutorChange as (updates: Partial<MagenticOrchestratorExecutor>) => void}
              />
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Bottom Actions - Footer */}
      <div className="border-t border-border bg-secondary px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className="text-sm text-muted-foreground hover:text-foreground gap-2 transition-colors duration-200 ease-out"
        >
          {isMoreOpen ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              More
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEvaluate?.(selectedNode.id)}
          className="text-sm text-foreground hover:text-foreground gap-2 transition-colors duration-200 ease-out"
        >
          Evaluate
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </Panel>
  )
}
