import { useState } from "react";
import catalog from "./marketplace-catalog.json";
import { TextField, SelectField } from "../components/fields";
import { Badge } from "../components/ui/badge";
export function SourceCatalog() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const filtered = catalog.filter(
    (item) =>
      (status === "All" || item.status === status) &&
      (category === "All" || item.category === category) &&
      `${item.name} ${item.target}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main className="mx-auto max-w-6xl space-y-7">
      <header>
        <h1 className="text-3xl font-semibold">
          Your marketplace component system
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
          {catalog.length} source entries covering component adaptations and the
          shared border-glow utility. The third-party icon collection is
          excluded. Adapted means the reusable concept is implemented here; it
          does not imply identical props or backend integration. Each entry
          names its replacement and describes the adaptation.
        </p>
      </header>
      <div className="flex flex-wrap gap-3">
        {["Adapted", "Partial", "Planned"].map((value) => (
          <Badge
            key={value}
            variant={value === "Adapted" ? "secondary" : "outline"}
          >
            {catalog.filter((item) => item.status === value).length}{" "}
            {value.toLowerCase()}
          </Badge>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_180px_220px]">
        <TextField
          label="Find a source component"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Card, wizard, table…"
        />
        <SelectField
          label="Status"
          value={status}
          onValueChange={setStatus}
          options={["All", "Adapted", "Partial", "Planned"].map((value) => ({
            value,
            label: value,
          }))}
        />
        <SelectField
          label="Category"
          value={category}
          onValueChange={setCategory}
          options={[
            "All",
            ...new Set(catalog.map((item) => item.category)),
          ].map((value) => ({ value, label: value }))}
        />
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {filtered.length} source components shown
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <article
            key={item.name}
            className="min-w-0 rounded-xl border bg-card p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">{item.name}</h2>
              <Badge
                variant={item.status === "Adapted" ? "secondary" : "outline"}
              >
                {item.status}
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.note}
            </p>
            {item.story && (
              <a
                target="_top"
                href={`./?path=/story/${item.story}`}
                className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4"
              >
                Explore {item.target}
              </a>
            )}
            <details className="mt-4 text-xs text-muted-foreground">
              <summary className="cursor-pointer">
                Source reference · {item.stories} original stories
              </summary>
              <code className="mt-2 block break-all">{item.source}</code>
            </details>
          </article>
        ))}
      </div>
      {!filtered.length && <p>No source components match these filters.</p>}
    </main>
  );
}
