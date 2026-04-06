import { useState } from "react";
import inspirationData from "@/data/inspiration_library.json";

const withBase = (relPath: string) => {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "/")}${relPath.replace(/^\/+/, "")}`;
};

const PLACEHOLDER = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#e5e7eb"/><text x="400" y="310" font-size="24" fill="#9ca3af" text-anchor="middle" font-family="ui-sans-serif">No image</text></svg>`
)}`;

type InspirationItem = {
  id: string;
  title?: string;
  creator?: string;
  profile?: string;
  physical: string[];
  mechanisms: string[];
  link?: string;
  image: string;
};

const items = inspirationData as InspirationItem[];

// Collect unique physical tags from all items, sorted alphabetically
const allPhysicalTags = Array.from(
  new Set(items.flatMap(item => item.physical))
).sort();

export function InspirationLibraryPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => setSelectedTags([]);

  const filteredItems = selectedTags.length === 0
    ? items
    : items.filter(item =>
        selectedTags.every(tag => item.physical.includes(tag))
      );

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-12">

      {/* Filter Section */}
      <div className="mb-8 pb-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground">Filter by Physical Attributes</h3>
          {selectedTags.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all ({selectedTags.length})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {allPhysicalTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-black text-white"
                  : "bg-muted hover:bg-muted/70"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="mb-6">
        <p className="text-1xl font-semibold text-foreground">
          Showing <span className="text-xl font-bold">{filteredItems.length}</span> of {items.length} items
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 grid-cols-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col h-[420px]"
          >
            <div className="bg-muted overflow-hidden max-h-[50%] flex-shrink-0">
              <img
                src={withBase(item.image)}
                alt={item.title ?? item.id}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
              />
            </div>

            <div className="flex flex-col flex-1 p-4 gap-3 overflow-hidden">
              {item.title && (
                <h3 className="font-semibold text-sm leading-snug">{item.title}</h3>
              )}

              {item.creator && (
                <p className="text-xs text-muted-foreground">
                  by{" "}
                  {item.profile ? (
                    <a href={item.profile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {item.creator}
                    </a>
                  ) : item.creator}
                </p>
              )}

              {item.physical.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.physical.map((tag) => (
                    <span key={tag} className="inline-block px-3 py-1 text-xs rounded-full bg-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {item.link && (
                <div className="mt-auto pt-2">
                  <button
                    onClick={() => window.open(item.link!, "_blank", "noopener,noreferrer")}
                    className="w-full px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    🔗 Link
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No items match the selected filters.
        </div>
      )}
    </div>
  );
}
