import { useId, useRef, useState, type ReactNode } from "react";
import { MessageScroller } from "@shadcn/react/message-scroller";
import { ArrowDown, ArrowUp, Paperclip, Square, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { GenerationStatus } from "./motion";
import { cn } from "../lib/utils";
import { Message, MessageContent, MessageHeader } from "./ui/message";
import { Bubble, BubbleContent } from "./ui/bubble";
import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
} from "./ui/attachment";
import { Marker, MarkerContent } from "./ui/marker";
export interface ChatAttachment {
  id: string;
  name: string;
  url?: string;
}
export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: ChatAttachment[];
  detail?: { title: string; content: string };
}
export function ChatMessage({
  message,
  streaming = false,
}: {
  message: ChatMessageData;
  streaming?: boolean;
}) {
  return (
    <Message
      role="article"
      aria-label={message.role === "user" ? "You" : "Assistant"}
      align={message.role === "user" ? "end" : "start"}
    >
      <MessageContent>
        <MessageHeader>
          {message.role === "user" ? "You" : "Studio"}
        </MessageHeader>
        {message.detail && (
          <details className="w-full border-l-2 border-secondary pl-3 text-sm">
            <summary className="cursor-pointer py-2 text-primary">
              {message.detail.title}
            </summary>
            <p className="pb-3 text-muted-foreground">
              {message.detail.content}
            </p>
          </details>
        )}
        <Bubble
          variant={message.role === "user" ? "muted" : "ghost"}
          align={message.role === "user" ? "end" : "start"}
        >
          <BubbleContent
            className="whitespace-pre-wrap"
            aria-hidden={streaming || undefined}
          >
            {message.content || (streaming ? <GenerationStatus /> : null)}
          </BubbleContent>
        </Bubble>
        {message.attachments?.map((a) => (
          <Attachment key={a.id} size="sm">
            <AttachmentMedia>
              <Paperclip aria-hidden />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>
                {a.url ? (
                  <a className="underline" href={a.url}>
                    {a.name}
                  </a>
                ) : (
                  a.name
                )}
              </AttachmentTitle>
            </AttachmentContent>
          </Attachment>
        ))}
      </MessageContent>
    </Message>
  );
}
export interface ChatComposerProps {
  onSend: (text: string, files: File[]) => void;
  busy?: boolean;
  onStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
}
export function ChatComposer({
  onSend,
  busy = false,
  onStop,
  disabled = false,
  placeholder = "Describe your next idea…",
  defaultValue = "",
}: ChatComposerProps) {
  const [text, setText] = useState(defaultValue);
  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const hint = useId();
  function submit() {
    if (busy || disabled || (!text.trim() && !files.length)) return;
    onSend(text.trim(), files);
    setText("");
    setFiles([]);
  }
  return (
    <form
      aria-label="Message composer"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="rounded-xl border bg-muted/45 p-3"
    >
      <Textarea
        aria-label="Message"
        aria-describedby={hint}
        value={text}
        disabled={disabled || busy}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
        }}
        className="min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
      />
      {files.length > 0 && (
        <ul className="my-2 flex flex-wrap gap-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-1 rounded-md bg-card pl-2 text-xs"
            >
              {file.name}
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label={`Remove ${file.name}`}
                onClick={() =>
                  setFiles((current) => current.filter((_, j) => i !== j))
                }
              >
                <X aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center justify-between gap-2">
        <input
          ref={fileInput}
          type="file"
          multiple
          className="hidden"
          aria-label="Attach files"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files ?? []);
            setFiles((current) => [...current, ...selectedFiles]);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Attach files"
          disabled={busy || disabled}
          onClick={() => fileInput.current?.click()}
        >
          <Paperclip aria-hidden />
        </Button>
        <p id={hint} className="text-xs text-muted-foreground">
          Shift + Enter for a new line
        </p>
        {busy && onStop ? (
          <Button
            type="button"
            size="icon"
            aria-label="Stop response"
            onClick={onStop}
          >
            <Square aria-hidden className="size-3" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            disabled={busy || disabled || (!text.trim() && !files.length)}
          >
            <ArrowUp aria-hidden />
          </Button>
        )}
      </div>
    </form>
  );
}
export interface ChatPanelProps {
  messages: ChatMessageData[];
  title?: string;
  busy?: boolean;
  onSend: ChatComposerProps["onSend"];
  onStop?: () => void;
  headerAction?: ReactNode;
  footer?: ReactNode;
  announcement?: string;
  className?: string;
}
export function ChatPanel({
  messages,
  title = "Creative assistant",
  busy = false,
  onSend,
  onStop,
  headerAction,
  footer,
  announcement,
  className,
}: ChatPanelProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        "flex h-[620px] min-h-0 flex-col overflow-hidden rounded-xl border bg-card",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b px-5 py-4">
        <h2 className="font-semibold">{title}</h2>
        {headerAction}
      </header>
      <MessageScroller.Provider defaultScrollPosition="end" autoScroll>
        <MessageScroller.Root className="relative min-h-0 flex-1">
          <MessageScroller.Viewport
            aria-label="Conversation"
            className="size-full overflow-y-auto overscroll-contain"
          >
            <MessageScroller.Content
              aria-live="off"
              className="flex min-h-full flex-col gap-5 p-5"
            >
              <MessageScroller.Item messageId="conversation-start">
                <Marker variant="separator">
                  <MarkerContent>Creative session</MarkerContent>
                </Marker>
              </MessageScroller.Item>
              {messages.map((message, index) => (
                <MessageScroller.Item
                  key={message.id}
                  messageId={message.id}
                  scrollAnchor={message.role === "user"}
                >
                  <ChatMessage
                    message={message}
                    streaming={
                      busy &&
                      index === messages.length - 1 &&
                      message.role === "assistant"
                    }
                  />
                </MessageScroller.Item>
              ))}
            </MessageScroller.Content>
          </MessageScroller.Viewport>
          <MessageScroller.Button
            aria-label="Jump to latest"
            className="absolute bottom-3 left-1/2 grid size-10 -translate-x-1/2 place-items-center rounded-full border bg-card shadow-lg data-[active=false]:invisible"
          >
            <ArrowDown aria-hidden className="size-4" />
          </MessageScroller.Button>
        </MessageScroller.Root>
      </MessageScroller.Provider>
      <div role="status" className="sr-only">
        {announcement ?? (busy ? "Assistant is responding." : "")}
      </div>
      <div className="space-y-3 p-4">
        {footer}
        <ChatComposer onSend={onSend} busy={busy} onStop={onStop} />
      </div>
    </section>
  );
}
