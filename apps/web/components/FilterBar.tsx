"use client";

import React from "react";
import { X } from "lucide-react";
import type { EntryType } from "../lib/api";

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
  const hasActiveFilters = Boolean(selectedCategory || selectedTag || searchQuery || selectedType);

  return (
    <div className="filter-bar">
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <div className="type-pills">
          <button
            className={`type-pill ${selectedType === "" ? "active" : ""}`}
            onClick={() => onSelectType("")}
          >
            All Types
          </button>
          <button
            className={`type-pill ${selectedType === "COMMAND" ? "active" : ""}`}
            onClick={() => onSelectType("COMMAND")}
          >
            Commands
          </button>
          <button
            className={`type-pill ${selectedType === "NOTE" ? "active" : ""}`}
            onClick={() => onSelectType("NOTE")}
          >
            Notes
          </button>
          <button
            className={`type-pill ${selectedType === "SNIPPET" ? "active" : ""}`}
            onClick={() => onSelectType("SNIPPET")}
          >
            Snippets
          </button>
        </div>

        {selectedCategory && (
          <span className="active-filter-badge">
            Category: {selectedCategoryName || selectedCategory}
            <button className="clear-btn" onClick={onClearCategory} title="Clear category filter">
              <X size={14} />
            </button>
          </span>
        )}

        {selectedTag && (
          <span className="active-filter-badge">
            Tag: #{selectedTag}
            <button className="clear-btn" onClick={onClearTag} title="Clear tag filter">
              <X size={14} />
            </button>
          </span>
        )}

        {searchQuery && (
          <span className="active-filter-badge">
            Search: &quot;{searchQuery}&quot;
            <button className="clear-btn" onClick={onClearSearch} title="Clear search query">
              <X size={14} />
            </button>
          </span>
        )}
      </div>

      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
        {entriesCount} {entriesCount === 1 ? "entry" : "entries"} found
      </div>
    </div>
  );
}
