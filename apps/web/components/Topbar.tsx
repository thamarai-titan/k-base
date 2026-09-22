"use client";

import React from "react";
import { Search, Plus, FolderPlus } from "lucide-react";

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewEntry: () => void;
  onOpenNewCategory: () => void;
}

export function Topbar({
  searchQuery,
  onSearchChange,
  onOpenNewEntry,
  onOpenNewCategory,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search commands, notes, snippets, keywords..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        <button
          className="btn btn-secondary"
          onClick={onOpenNewCategory}
          title="Create a new category"
        >
          <FolderPlus size={16} />
          <span>New Category</span>
        </button>

        <button
          className="btn btn-primary"
          onClick={onOpenNewEntry}
          title="Add a new command, note or snippet"
        >
          <Plus size={16} />
          <span>New Entry</span>
        </button>
      </div>
    </header>
  );
}
