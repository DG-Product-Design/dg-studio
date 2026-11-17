import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, themes } from "../components/theme";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
function Palettes() {
  return (
    <main className="mx-auto max-w-6xl">
      <h1 className="text-4xl font-semibold">Four moods. One language.</h1>
      <p className="mt-3 mb-8 text-muted-foreground">
        Shared semantic tokens keep surfaces, text, focus, and feedback
        consistent.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {themes.map((theme) => (
          <ThemeProvider
            key={theme.value}
            theme={theme.value}
            className="rounded-xl border p-6"
          >
            <h2 className="text-2xl font-semibold">{theme.label}</h2>
            <div
              className="my-6 flex gap-2"
              aria-label={`${theme.label} color swatches`}
            >
              {[
                "background",
                "card",
                "primary",
                "secondary",
                "muted",
                "foreground",
              ].map((token) => (
                <div
                  key={token}
                  title={token}
                  className="aspect-square flex-1 rounded-full border"
                  style={{ background: `var(--${token})` }}
                />
              ))}
            </div>
            <p className="mb-5 text-sm text-muted-foreground">
              A palette for images, ideas, and everything you’re building next.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button>Start creating</Button>
              <Button variant="outline">Explore</Button>
              <Badge variant="secondary">Ready</Badge>
            </div>
          </ThemeProvider>
        ))}
      </div>
    </main>
  );
}
const meta = {
  title: "Foundations/Themes",
  component: Palettes,
} satisfies Meta<typeof Palettes>;
export default meta;
export const AllPalettes: StoryObj<typeof meta> = {};
export const Primitives: StoryObj = {
  render: () => {
    const [name, setName] = useState("Trailbound");
    return (
      <div className="max-w-lg space-y-6">
        <h1 className="text-3xl font-semibold">Everyday essentials</h1>
        <div className="flex flex-wrap gap-2">
          {(
            ["default", "secondary", "outline", "ghost", "destructive"] as const
          ).map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
          <Button disabled>Disabled</Button>
        </div>
        <label className="grid gap-2">
          Collection name
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="grid gap-2">
          Creative direction
          <Textarea placeholder="Tell us what you have in mind…" />
        </label>
        <div className="flex gap-2">
          <Badge>Draft</Badge>
          <Badge variant="secondary">Approved</Badge>
          <Badge variant="outline">Archived</Badge>
        </div>
      </div>
    );
  },
};
