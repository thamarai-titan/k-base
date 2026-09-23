"use client";

import React from "react";
import { Folder, Hash, Plus, Layers, Tag as TagIcon, Trash2, Terminal } from "lucide-react";
import type { Category, Tag } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
  selectedCategory: string;
  selectedTag: string;
  totalEntriesCount: number;
  onSelectCategory: (slug: string) => void;
  onSelectTag: (tagName: string) => void;
  onOpenNewCategory: () => void;
  onDeleteCategory: (id: string, name: string) => void;
}

export function Sidebar({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  totalEntriesCount,
  onSelectCategory,
  onSelectTag,
  onOpenNewCategory,
  onDeleteCategory,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-icon">
            <Terminal size={15} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="brand-title">k-base</span>
              <span className="brand-badge">Engine</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">
              Knowledge Hub
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Navigation</div>
        <ul className="nav-list">
          <li
            className={`nav-item ${selectedCategory === "" && selectedTag === "" ? "active" : ""}`}
            onClick={() => {
              onSelectCategory("");
              onSelectTag("");
            }}
          >
            <span className="flex items-center gap-2">
              <Layers size={14} className="text-muted-foreground" />
              <span>All Knowledge</span>
            </span>
            <span className="nav-count">{totalEntriesCount}</span>
          </li>
        </ul>
      </div>

      {/* Categories Section */}
      <div className="sidebar-section flex-1 overflow-y-auto">
        <div className="sidebar-section-title">
          <span>Categories</span>
          <Button
            variant="ghost"
            size="iconSm"
            className="h-5 w-5 text-muted-foreground hover:text-foreground"
            title="Create Category"
            onClick={onOpenNewCategory}
          >
            <Plus size={13} />
          </Button>
        </div>

        <ul className="nav-list">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug || selectedCategory === cat.id;
            return (
              <li
                key={cat.id}
                className={`nav-item group ${isActive ? "active" : ""}`}
                onClick={() => onSelectCategory(cat.slug)}
              >
                <span className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  <Folder
                    size={13}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span className="overflow-hidden text-ellipsis">{cat.name}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="nav-count">{cat._count?.entries ?? 0}</span>
                  <Button
                    variant="ghost"
                    size="iconSm"
                    className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    title={`Delete ${cat.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(cat.id, cat.name);
                    }}
                  >
                    <Trash2 size={11} />
                  </Button>
                </div>
              </li>
            );
          })}
          {categories.length === 0 && (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              No categories yet
            </div>
          )}
        </ul>
      </div>

      {/* Popular Tags Section */}
      <div className="sidebar-section mt-auto border-t border-border/50 pb-5 pt-3">
        <div className="sidebar-section-title">
          <span className="flex items-center gap-1.5">
            <TagIcon size={12} />
            <span>Popular Tags</span>
          </span>
        </div>
        <div className="tags-cloud">
          {tags.map((tag) => {
            const isTagActive = selectedTag.toLowerCase() === tag.name.toLowerCase();
            return (
              <Badge
                key={tag.id}
                variant={isTagActive ? "default" : "tag"}
                onClick={() => onSelectTag(isTagActive ? "" : tag.name)}
                className="text-[10px] py-0.5 px-2 transition-colors"
              >
                <Hash size={9} className="inline mr-0.5 opacity-70" />
                {tag.name}
              </Badge>
            );
          })}
          {tags.length === 0 && (
            <div className="text-[11px] text-muted-foreground px-1">
              Tags appear here as you create entries
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
