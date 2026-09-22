"use client";

import React from "react";
import { Folder, Hash, Plus, Layers, Tag as TagIcon, Trash2 } from "lucide-react";
import type { Category, Tag } from "../lib/api";

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
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-icon">K</div>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="brand-title">k-base</span>
              <span className="brand-badge">Engine</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Personal Knowledge Hub
            </div>
          </div>
        </div>
      </div>

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
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Layers size={16} /> All Knowledge
            </span>
            <span className="nav-count">{totalEntriesCount}</span>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">
          <span>Categories</span>
          <button
            className="sidebar-action-btn"
            title="Create Category"
            onClick={onOpenNewCategory}
          >
            <Plus size={15} />
          </button>
        </div>

        <ul className="nav-list">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug || selectedCategory === cat.id;
            return (
              <li
                key={cat.id}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => onSelectCategory(cat.slug)}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <Folder size={15} style={{ color: isActive ? "#60a5fa" : "var(--text-muted)", flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{cat.name}</span>
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="nav-count">{cat._count?.entries ?? 0}</span>
                  <button
                    className="sidebar-action-btn"
                    title={`Delete ${cat.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(cat.id, cat.name);
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            );
          })}
          {categories.length === 0 && (
            <div style={{ padding: "8px 12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              No categories yet
            </div>
          )}
        </ul>
      </div>

      <div className="sidebar-section" style={{ marginTop: "auto", paddingBottom: "24px" }}>
        <div className="sidebar-section-title">
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <TagIcon size={14} /> Popular Tags
          </span>
        </div>
        <div className="tags-cloud">
          {tags.map((tag) => {
            const isTagActive = selectedTag.toLowerCase() === tag.name.toLowerCase();
            return (
              <button
                key={tag.id}
                className={`tag-chip ${isTagActive ? "active" : ""}`}
                onClick={() => onSelectTag(isTagActive ? "" : tag.name)}
              >
                <Hash size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: "2px" }} />
                {tag.name}
              </button>
            );
          })}
          {tags.length === 0 && (
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "4px" }}>
              Tags appear here as you create entries
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
