"use client";

import React from "react";
import { X, Terminal, BookOpen, Code, Layers } from "lucide-react";
import type { EntryType } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  selectedType: EntryType | "";
  onSelectType: (type: EntryType | "") => void;
  selectedCategory: string;
  selectedCategoryName?: string;
  onClearCategory: () => void;
  selectedTag: string;
  onClearTag: () => void;
  searchQuery: string;
  onClearSearch: () => void;
  entriesCount: number;
}

export function FilterBar({
  selectedType,
  onSelectType,
  selectedCategory,
  selectedCategoryName,
  onClearCategory,
  selectedTag,
  onClearTag,
  searchQuery,
  onClearSearch,
  entriesCount,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Segmented Type Control - Clean, Solid & Rich */}
        <div className="inline-flex items-center rounded-md bg-[#11141d] p-0.5 border border-border">
          <button
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all ${
              selectedType === ""
                ? "bg-foreground text-background font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onSelectType("")}
          >
            <Layers size={12} />
            All Types
          </button>
          <button
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all ${
              selectedType === "COMMAND"
                ? "bg-foreground text-background font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onSelectType("COMMAND")}
          >
            <Terminal size={12} className={selectedType === "COMMAND" ? "text-background" : "text-emerald-400"} />
            Commands
          </button>
          <button
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all ${
              selectedType === "NOTE"
                ? "bg-foreground text-background font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onSelectType("NOTE")}
          >
            <BookOpen size={12} className={selectedType === "NOTE" ? "text-background" : "text-amber-400"} />
            Notes
          </button>
          <button
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all ${
              selectedType === "SNIPPET"
                ? "bg-foreground text-background font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onSelectType("SNIPPET")}
          >
            <Code size={12} className={selectedType === "SNIPPET" ? "text-background" : "text-blue-400"} />
            Snippets
          </button>
        </div>

        {selectedCategory && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 py-1 px-2.5 text-xs font-medium border-border bg-[#141824] text-foreground"
          >
            <span className="text-muted-foreground">Category:</span>
            <span>{selectedCategoryName || selectedCategory}</span>
            <Button
              variant="ghost"
              size="iconSm"
              className="h-3.5 w-3.5 p-0 hover:bg-transparent hover:text-foreground text-muted-foreground ml-0.5"
              onClick={onClearCategory}
              title="Clear category filter"
            >
              <X size={11} />
            </Button>
          </Badge>
        )}

        {selectedTag && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 py-1 px-2.5 text-xs font-medium border-border bg-[#141824] text-foreground font-mono"
          >
            <span className="text-muted-foreground">Tag:</span>
            <span>#{selectedTag}</span>
            <Button
              variant="ghost"
              size="iconSm"
              className="h-3.5 w-3.5 p-0 hover:bg-transparent hover:text-foreground text-muted-foreground ml-0.5"
              onClick={onClearTag}
              title="Clear tag filter"
            >
              <X size={11} />
            </Button>
          </Badge>
        )}

        {searchQuery && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 py-1 px-2.5 text-xs font-medium border-border bg-[#141824] text-foreground"
          >
            <span className="text-muted-foreground">Search:</span>
            <span>&quot;{searchQuery}&quot;</span>
            <Button
              variant="ghost"
              size="iconSm"
              className="h-3.5 w-3.5 p-0 hover:bg-transparent hover:text-foreground text-muted-foreground ml-0.5"
              onClick={onClearSearch}
              title="Clear search query"
            >
              <X size={11} />
            </Button>
          </Badge>
        )}
      </div>

      <div className="text-xs text-muted-foreground font-mono tabular-nums">
        <span className="font-semibold text-foreground">{entriesCount}</span>{" "}
        {entriesCount === 1 ? "entry" : "entries"}
      </div>
    </div>
  );
}
