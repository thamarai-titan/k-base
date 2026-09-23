"use client";

import React from "react";
import { Search, Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <Search size={15} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search commands, notes, snippets, tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        <Button
          variant="outline"
          onClick={onOpenNewCategory}
          title="Create a new category"
          className="gap-2 text-xs"
        >
          <FolderPlus className="h-3.5 w-3.5 text-muted-foreground" />
          <span>New Category</span>
        </Button>

        <Button
          variant="default"
          onClick={onOpenNewEntry}
          title="Add a new command, note or snippet"
          className="gap-1.5 text-xs font-semibold"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Entry</span>
        </Button>
      </div>
    </header>
  );
}
