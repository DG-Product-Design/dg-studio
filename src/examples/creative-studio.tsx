import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { ChatPanel, type ChatMessageData } from "../components/chat";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageFade } from "../components/image-fade";
type Ratio = "1:1" | "4:5" | "9:16";
const initial: ChatMessageData[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Your trail campaign has a first draft. Try a dusk palette, choose a new format, or change the headline.",
  },
];
/** Local scripted adapter. Replace send() with your transport; ChatPanel has no AI SDK dependency. */
export function CreativeStudio() {
  const [messages, setMessages] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [dusk, setDusk] = useState(false);
  const [scenic, setScenic] = useState(false);
  const [logo, setLogo] = useState(false);
  const [ratio, setRatio] = useState<Ratio>("4:5");
  const [askRatio, setAskRatio] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  useEffect(() => () => clearInterval(timer.current), []);
  function stop() {
    clearInterval(timer.current);
    setBusy(false);
    setAnnouncement("Response stopped.");
    setMessages((current) =>
      current.map((m, i) =>
        i === current.length - 1 && m.role === "assistant" && !m.content
          ? { ...m, content: "Response stopped." }
          : m,
      ),
    );
  }
  function reset() {
    clearInterval(timer.current);
    setMessages(initial);
    setBusy(false);
    setDusk(false);
    setScenic(false);
    setLogo(false);
    setRatio("4:5");
    setAskRatio(false);
    setAnnouncement("Demo restarted.");
  }
  function send(prompt: string, files: File[] = []) {
    if (busy) return;
    const lower = prompt.toLowerCase();
    const chosen = (["1:1", "4:5", "9:16"] as const).find((r) =>
      lower.includes(r),
    );
    let reply =
      "This local demo supports dusk colors, feed formats, headline changes, and adding the Trailbound logo. Try one of the suggested edits below.";
    let action: (() => void) | undefined;
    let detail: ChatMessageData["detail"];
    if (files.length)
      reply = `Attached ${files.map((f) => f.name).join(", ")}. Files stay in your browser in this demo; connect an upload handler to use them with your model.`;
    else if (chosen) {
      reply = `Here’s the ${chosen} version. I kept the artwork and headline.`;
      action = () => {
        setRatio(chosen);
        setAskRatio(false);
      };
      detail = {
        title: "Reframed for Instagram",
        content: `Canvas ratio set to ${chosen}.`,
      };
    } else if (/dusk|palette|color/.test(lower)) {
      reply =
        "Here’s the dusk version. I kept the cream lettering and mountain motif.";
      action = () => setDusk(true);
      detail = {
        title: "Updated the palette",
        content: "Daylight greens changed to dusk purples and coral.",
      };
    } else if (/ratio|feed|format|reframe/.test(lower)) {
      reply = "Which aspect ratio should I target: 1:1, 4:5, or 9:16?";
      action = () => setAskRatio(true);
    } else if (/headline|scenic/.test(lower)) {
      reply =
        "“Take the Scenic Route” is in. I kept the mountain motif and current framing.";
      action = () => {
        setScenic(true);
        setDusk(true);
      };
      detail = {
        title: "Updated the headline",
        content: "Applied the prepared Scenic Route artwork.",
      };
    } else if (/logo|brand/.test(lower)) {
      reply = "I centered the Trailbound logo above the bottom edge.";
      action = () => setLogo(true);
      detail = {
        title: "Placed the brand logo",
        content: "The mark uses the same cream color as the headline.",
      };
    }
    const id = crypto.randomUUID();
    setMessages((current) => [
      ...current,
      {
        id: `${id}-user`,
        role: "user",
        content: prompt,
        attachments: files.map((f, i) => ({ id: String(i), name: f.name })),
      },
      { id, role: "assistant", content: "" },
    ]);
    setBusy(true);
    setAnnouncement("Updating your creative.");
    let progress = -12;
    timer.current = setInterval(() => {
      progress += 4;
      setMessages((current) =>
        current.map((m) =>
          m.id === id
            ? { ...m, content: reply.slice(0, Math.max(0, progress)) }
            : m,
        ),
      );
      if (progress >= reply.length) {
        clearInterval(timer.current);
        action?.();
        setMessages((current) =>
          current.map((m) => (m.id === id ? { ...m, detail } : m)),
        );
        setBusy(false);
        setAnnouncement(reply);
      }
    }, 35);
  }
  const file = scenic
    ? ratio === "1:1"
      ? "take-the-scenic-route-dusk-feed.webp"
      : `ad-scenic-route-${ratio.replace(":", "x")}.webp`
    : dusk
      ? ratio === "1:1"
        ? "get-outside-v2.webp"
        : `ad-get-outside-${ratio.replace(":", "x")}.webp`
      : "get-outside-v1.webp";
  const [w, h] = ratio.split(":").map(Number);
  return (
    <section className="mx-auto max-w-6xl">
      <header className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Creative studio
          </h1>
          <p className="mt-2 text-muted-foreground">
            A conversation on the left. Your next idea on the right.
          </p>
        </div>
        <Badge variant="secondary">Interactive local demo</Badge>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <ChatPanel
          messages={messages}
          busy={busy}
          onSend={send}
          onStop={stop}
          announcement={announcement}
          headerAction={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Restart demo"
              onClick={reset}
            >
              <RotateCcw aria-hidden />
            </Button>
          }
          footer={
            <div className="flex flex-wrap gap-2">
              {(askRatio
                ? ["1:1", "4:5", "9:16"]
                : [
                    "Try a dusk palette",
                    "Reframe for the feed",
                    "Change the headline",
                    "Add my brand logo",
                  ]
              ).map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => send(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          }
        />
        <figure className="flex min-h-[480px] flex-col rounded-xl bg-muted/40 p-6">
          <div className="mb-5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Trailbound / Campaign preview</span>
            <span>{ratio}</span>
          </div>
          <div className="grid min-h-0 flex-1 place-items-center">
            <div
              className={`relative w-full max-w-[320px] overflow-hidden rounded-lg shadow-xl ${busy ? "dg-artwork-busy" : ""}`}
            >
              <ImageFade
                src={`./images/${file}`}
                imageClassName="object-contain"
                alt={`${scenic ? "Take the Scenic Route" : "Get Outside"} campaign in ${dusk ? "dusk" : "daylight"} colors`}
                width={w}
                height={h}
              />
              {logo && (
                <span className="absolute bottom-[7%] left-1/2 -translate-x-1/2 rounded bg-black/65 px-3 py-1 text-sm font-bold tracking-widest text-white">
                  △ TRAILBOUND
                </span>
              )}
            </div>
          </div>
          <figcaption className="mt-5 text-center text-xs text-muted-foreground">
            Prepared artwork responds to your edits. No model or API key
            required.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
