import * as React from "react";
import {
  ArrowUpIcon,
  AudioLines,
  ChevronsUpDownIcon,
  PaperclipIcon,
  Square,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/Button";
import { useAutosizeTextarea } from "@/lib/hooks/useAutosizeTextarea";
import { useSpeechRecognition } from "@/lib/hooks/useSpeechRecognition";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { defineSound } from "@web-kits/audio";
import { Tooltip } from "@/components/Tooltip";
type ModelOption = {
  id: string;
  name: string;
  providerId: string;
  providerName: string;
};

type Attachment = {
  id: string;
  file: File;
  previewUrl: string;
};

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "gpt-5.5",
    name: "GPT 5.5",
    providerId: "openai",
    providerName: "OpenAI",
  },
  {
    id: "claude-opus-4.8",
    name: "Claude Opus 4.8",
    providerId: "anthropic",
    providerName: "Anthropic",
  },
  {
    id: "kimi-2.6",
    name: "Kimi 2.6",
    providerId: "moonshotai",
    providerName: "Moonshot AI",
  },
  {
    id: "gemini-3.5",
    name: "Gemini 3.5",
    providerId: "google",
    providerName: "Google",
  },
];

const TRANSITION = {
  type: "spring" as const,
  duration: 0.2,
  bounce: 0,
};

const toggleOnSound = defineSound({
  layers: [
    {
      source: { type: "sine", frequency: { start: 400, end: 800 } },
      envelope: { attack: 0, decay: 0.08, sustain: 0, release: 0.025 },
      gain: 0.22,
    },
    {
      source: { type: "sine", frequency: { start: 600, end: 1200 } },
      envelope: { attack: 0, decay: 0.07, sustain: 0, release: 0.02 },
      delay: 0.04,
      gain: 0.18,
    },
  ],
});
const toggleOffSound = defineSound({
  layers: [
    {
      source: { type: "sine", frequency: { start: 800, end: 400 } },
      envelope: { attack: 0, decay: 0.08, sustain: 0, release: 0.025 },
      gain: 0.22,
    },
    {
      source: { type: "sine", frequency: { start: 600, end: 300 } },
      envelope: { attack: 0, decay: 0.07, sustain: 0, release: 0.02 },
      delay: 0.04,
      gain: 0.18,
    },
  ],
});

const CLICKABLE_DESCENDANTS =
  "button, a, [role='button'], [role='menuitem'], [role='combobox'], textarea, input, select, [contenteditable]";
const PRINTABLE_KEY = /^[\p{L}\p{N}]$/u;

function useFocusOnType(ref: React.RefObject<HTMLTextAreaElement | null>) {
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  React.useEffect(() => {
    if (!isInView) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.isComposing || !PRINTABLE_KEY.test(e.key)) return;

      // Inverted heuristic: only steal focus when the user is interacting
      // with the page itself (body/html) or nothing is focused. Any focused
      // element — button, link, video, menu, combobox, contenteditable, etc.
      // — wins, because those elements have their own key handling.
      const active = document.activeElement;
      if (active && active !== document.body && active !== document.documentElement) {
        return;
      }

      ref.current?.focus();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInView, ref]);
}

export function AgentChatInput() {
  const reduced = useReducedMotion();
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const {
    attachments,
    fileInputRef,
    clearAttachments,
    removeAttachment,
    handleUploadClick,
    handleFileInputChange,
    handlePaste,
    handleDrop,
    handleDragOver,
  } = useAgentChatAttachments();
  const { finalTranscript, interimTranscript, state, isSupported, start, stop } =
    useSpeechRecognition();

  // While listening, the textarea value is seeded from the *final* transcript only.
  // Interim (in-progress) text is rendered as a ghost overlay so we don't clobber
  // what the user is typing and don't leave a trailing "…" in the value.
  React.useEffect(() => {
    if (state === "listening") {
      setValue(finalTranscript);
    }
  }, [finalTranscript, state]);

  useAutosizeTextarea(textareaRef, value, { minHeight: 48, maxHeight: 120 });
  useFocusOnType(textareaRef);

  const hasMessage = value.trim().length > 0;
  const hasAttachments = attachments.length > 0;
  const canUseDictation = !hasMessage && !hasAttachments && isSupported;
  const isListening = state === "listening";

  function handleFocus(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    // Let interactive descendants handle their own focus.
    if (target.closest(CLICKABLE_DESCENDANTS)) return;
    textareaRef.current?.focus();
  }

  function handleSend() {
    if (!hasMessage && !hasAttachments) return;
    setValue("");
    clearAttachments();
    textareaRef.current?.focus();
  }

  function handleDictation() {
    if (isListening) {
      stop();
      toggleOffSound();
    } else {
      toggleOnSound();
      start();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      role="group"
      aria-label="Chat input"
      aria-describedby={isListening ? "dictation-active" : undefined}
      className="bg-background border shadow-xs rounded-lg flex flex-col w-120 [&:has(textarea:focus)]:ring-2 [&:has(textarea:focus)]:ring-ring [&:has(textarea:focus)]:ring-offset-2 [&:has(textarea:focus)]:ring-offset-background"
      onClick={handleFocus}
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />
      <AgentChatAttachments
        attachments={attachments}
        reduced={reduced}
        removeAttachment={removeAttachment}
      />
      <div className="relative">
        <textarea
          ref={textareaRef}
          rows={1}
          name="chat"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message…"
          aria-label="Message"
          className="w-full px-3 pt-2 resize-none border-0 pb-0 max-h-30 shrink-0 text-primary placeholder:text-gray-9 focus:outline-none bg-transparent"
        />
        {isListening && interimTranscript ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 px-3 pt-2 text-primary whitespace-pre-wrap break-words"
          >
            <span className="opacity-0">{value}</span>
            <span className="text-gray-9">{interimTranscript}</span>
          </div>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-2 p-1.5">
        <Tooltip content="Upload images">
          <Button
            size="icon"
            className="size-8"
            variant="ghost"
            aria-label="Upload images"
            onClick={handleUploadClick}
          >
            <PaperclipIcon className="size-4 text-primary" />
          </Button>
        </Tooltip>
        <div className="flex items-center justify-end gap-2 ml-auto">
          <AgentChatInputModelSelect />
          {isListening && (
            <span id="dictation-active" className="sr-only">
              Dictation is active
            </span>
          )}
          <Tooltip content={isListening ? "Stop" : canUseDictation ? "Use voice" : "Send"}>
            <Button
              size="icon"
              className="size-8"
              variant={isListening || canUseDictation ? "ghost" : "accent"}
              aria-label={
                isListening ? "Stop dictation" : canUseDictation ? "Use voice" : "Send message"
              }
              aria-pressed={isListening || canUseDictation ? isListening : undefined}
              onClick={isListening || canUseDictation ? handleDictation : handleSend}
            >
              <SendButtonIcon
                canUseDictation={canUseDictation}
                isListening={isListening}
                reduced={reduced}
              />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function useAgentChatAttachments() {
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const attachmentsRef = React.useRef<Attachment[]>([]);

  attachmentsRef.current = attachments;

  React.useEffect(() => {
    return () => {
      attachmentsRef.current.forEach(attachment => URL.revokeObjectURL(attachment.previewUrl));
    };
  }, []);

  const addFiles = React.useCallback((files: Iterable<File>) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"));

    if (imageFiles.length === 0) return;

    setAttachments(current => [
      ...current,
      ...imageFiles.map(file => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  }, []);

  const removeAttachment = React.useCallback((id: string) => {
    // Look up via ref to keep the state updater pure (React strict-mode runs
    // updaters twice; we must not revoke the same URL twice).
    const removed = attachmentsRef.current.find(item => item.id === id);
    setAttachments(current => current.filter(item => item.id !== id));
    if (removed) URL.revokeObjectURL(removed.previewUrl);
  }, []);

  const clearAttachments = React.useCallback(() => {
    attachmentsRef.current.forEach(attachment => URL.revokeObjectURL(attachment.previewUrl));
    attachmentsRef.current = [];
    setAttachments([]);
  }, []);

  function handleUploadClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    fileInputRef.current?.click();
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      addFiles(e.target.files);
    }

    e.target.value = "";
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const pastedFiles = Array.from(e.clipboardData.items)
      .filter(item => item.kind === "file" && item.type.startsWith("image/"))
      .map(item => item.getAsFile())
      .filter((file): file is File => file !== null);

    if (pastedFiles.length === 0) return;

    const pastedText = e.clipboardData.getData("text/plain");
    if (pastedText.trim().length === 0) {
      e.preventDefault();
    }
    addFiles(pastedFiles);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  return {
    attachments,
    fileInputRef,
    clearAttachments,
    removeAttachment,
    handleUploadClick,
    handleFileInputChange,
    handlePaste,
    handleDrop,
    handleDragOver,
  };
}

function SendButtonIcon({
  canUseDictation,
  isListening,
  reduced,
}: {
  canUseDictation: boolean;
  isListening: boolean;
  reduced: boolean | null;
}) {
  const icon = isListening ? (
    <Square className="size-4 text-red-600" />
  ) : canUseDictation ? (
    <AudioLines className="size-4 text-primary" />
  ) : (
    <ArrowUpIcon className="size-4 text-white" />
  );

  if (reduced) {
    return icon;
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={isListening ? "stop" : canUseDictation ? "audio" : "arrow"}
        initial={{ opacity: 0, scale: 0.5, filter: "blur(2px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.5, filter: "blur(2px)" }}
        transition={TRANSITION}
      >
        {icon}
      </motion.div>
    </AnimatePresence>
  );
}

function ModelIcon({ providerId, providerName }: { providerId: string; providerName: string }) {
  return (
    <div className="size-5 shrink-0 overflow-hidden rounded-full">
      <img
        src={`https://models.dev/logos/${providerId}.svg`}
        alt={`${providerName} logo`}
        className="size-full object-cover"
        loading="lazy"
        onError={e => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}

function AgentChatInputModelSelect() {
  const [model, setModel] = React.useState(MODEL_OPTIONS[0].id);
  const selectedModel = MODEL_OPTIONS.find(option => option.id === model);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-1.5 px-1.5 h-8 data-[state=open]:bg-gray-3"
        >
          {selectedModel && (
            <ModelIcon
              providerId={selectedModel.providerId}
              providerName={selectedModel.providerName}
            />
          )}
          <span className="max-w-40 truncate">{selectedModel?.name ?? "Select model"}</span>
          <ChevronsUpDownIcon className="size-3.5 ml-1.5 text-secondary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-80 overflow-y-auto"
        onCloseAutoFocus={e => e.preventDefault()}
      >
        {MODEL_OPTIONS.map(option => (
          <DropdownMenuItem
            key={`${option.providerId}:${option.id}`}
            onSelect={() => setModel(option.id)}
          >
            <ModelIcon providerId={option.providerId} providerName={option.providerName} />
            <span className="truncate font-medium">{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AgentChatAttachments({
  attachments,
  reduced,
  removeAttachment,
}: {
  attachments: Attachment[];
  reduced: boolean | null;
  removeAttachment: (id: string) => void;
}) {
  if (attachments.length === 0) return null;
  return (
    <div className="flex gap-2 overflow-x-auto p-2 pb-0">
      <AnimatePresence mode="popLayout" initial={false}>
        {attachments.map(attachment => (
          <motion.div
            key={attachment.id}
            initial={reduced ? false : { opacity: 0, filter: "blur(2px)" }}
            animate={reduced ? undefined : { opacity: 1, filter: "blur(0px)" }}
            exit={reduced ? undefined : { opacity: 0, filter: "blur(2px)" }}
            transition={reduced ? { duration: 0 } : TRANSITION}
            className="group relative size-16 shrink-0 overflow-hidden rounded-md border bg-gray-2"
          >
            <img
              src={attachment.previewUrl}
              alt={attachment.file.name}
              className="size-full object-cover"
              loading="lazy"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-1 top-1 size-5 bg-white/10 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-white/40"
              aria-label={`Remove ${attachment.file.name}`}
              onClick={e => {
                e.stopPropagation();
                removeAttachment(attachment.id);
              }}
            >
              <XIcon className="size-3" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export { AgentChatInput as AgentChatInputDemo };
