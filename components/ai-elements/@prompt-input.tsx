"use client";

import { useRef } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputSpeechButton,
  PromptInputAttachments,
  PromptInputAttachment,
} from "@/components/ai-elements/prompt-input";

type PromptPayload = {
  text?: string;
  files?: { url?: string; mediaType?: string; filename?: string }[];
};

export function BottomLeftPromptInput() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  async function handleSubmit(payload: PromptPayload) {
    void payload;
  }

  return (
    <div className="w-[28rem] max-w-[85vw] rounded-md border bg-background/60 p-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <PromptInput
        className="w-full"
        accept="image/*"
        multiple
        maxFiles={6}
        maxFileSize={10 * 1024 * 1024}
        onSubmit={handleSubmit}
      >
        <PromptInputBody>
          <div className="flex flex-wrap items-center gap-1 px-1 py-1">
            <PromptInputAttachments>
              {(file) => <PromptInputAttachment data={file} />}
            </PromptInputAttachments>
          </div>
          <PromptInputTextarea ref={textareaRef as any} placeholder="Ask or type a command..." />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger aria-label="More actions" />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <PromptInputSpeechButton textareaRef={textareaRef} aria-label="Dictate" />
          </PromptInputTools>
          <div className="flex items-center gap-1">
            <PromptInputButton aria-label="Settings">⚙️</PromptInputButton>
            <PromptInputSubmit />
          </div>
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

export default BottomLeftPromptInput;


