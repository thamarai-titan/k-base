"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Search, Plus, FolderPlus, X, Sparkles, Terminal, Code, BookOpen, Copy, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyControls } from "./TypographyControls";
import { HighlightedText } from "./HighlightedText";
import type { Entry, EntryType } from "@/lib/api";

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewEntry: () => void;
  onOpenNewCategory: () => void;
  selectedType?: EntryType | "";
  onSelectType?: (type: EntryType | "") => void;
  entries?: Entry[];
  onNotify?: (message: string) => void;
}

export function Topbar({
  searchQuery,
  onSearchChange,
  onOpenNewEntry,
  onOpenNewCategory,
  selectedType = "",
  onSelectType,
  entries = [],
  onNotify,
}: TopbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMac, setIsMac] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Platform detection for Mac (⌘K) vs Windows/Linux (Ctrl K)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const platform = navigator.userAgent || navigator.platform || "";
      setIsMac(/Mac|iPhone|iPad|iPod/i.test(platform));
    }
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K -> Focus & select search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setIsFocused(true);
        return;
      }

      // "/" shortcut to search when not typing in form controls
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      const isInputActive = ["INPUT", "TEXTAREA", "SELECT"].includes(activeTag || "");
      if (e.key === "/" && !isInputActive && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setIsFocused(true);
        return;
      }

      // Escape -> Clear query or blur search
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        e.preventDefault();
        if (searchQuery.trim().length > 0) {
          onSearchChange("");
        } else {
          inputRef.current?.blur();
          setIsFocused(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery, onSearchChange]);

  // Click outside to dismiss suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    onSearchChange("");
    inputRef.current?.focus();
  };

  // Quick matching results to preview commands & entries
  const matchingResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().replace(/^(cmds?|commands?):?/i, "").trim();
    if (!q) return entries.slice(0, 5);

    return entries
      .filter((e) => {
        const matchesContent = e.content.toLowerCase().includes(q);
        const matchesTitle = e.title.toLowerCase().includes(q);
        const matchesTags = e.tags?.some((t) => t.name.toLowerCase().includes(q));
        const matchesDesc = e.description?.toLowerCase().includes(q);
        return matchesContent || matchesTitle || matchesTags || matchesDesc;
      })
      .slice(0, 5);
  }, [entries, searchQuery]);

  const handleCopyCommand = async (e: React.MouseEvent, entry: Entry) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(entry.content);
      setCopiedId(entry.id);
      onNotify?.(`Copied "${entry.title}" command!`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      onNotify?.("Failed to copy");
    }
  };

  const handleJumpToEntry = (id: string) => {
    setIsFocused(false);
    const element = document.getElementById(`entry-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("ring-2", "ring-primary", "ring-offset-2", "ring-offset-background");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-primary", "ring-offset-2", "ring-offset-background");
      }, 1500);
    }
  };

  return (
    <header className="topbar">
      <div className="search-box" ref={containerRef}>
        <Search
          size={15}
          className={`search-icon transition-colors duration-150 ${
            isFocused ? "text-foreground" : "text-muted-foreground"
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search commands, notes, snippets (e.g. 'docker', 'git')... [⌘K]"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />

        {/* Keyboard shortcut badges or clear button */}
        <div className="search-badges">
          {searchQuery ? (
            <>
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClear}
                title="Clear search (Esc)"
              >
                <X size={12} />
              </button>
              <kbd
                className="search-kbd text-[9px] cursor-pointer hover:border-slate-500"
                onClick={handleClear}
                title="Press Esc to clear"
              >
                esc
              </kbd>
            </>
          ) : (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => {
                inputRef.current?.focus();
                setIsFocused(true);
              }}
              title={`Press ${isMac ? "⌘K" : "Ctrl+K"} or / to search`}
            >
              <kbd className="search-kbd">
                {isMac ? "⌘" : "Ctrl"}
              </kbd>
              <kbd className="search-kbd">K</kbd>
            </div>
          )}
        </div>

        {/* Live Search & Quick Command Palette Popover */}
        {isFocused && (
          <div className="absolute left-0 right-0 top-full mt-2 p-2.5 rounded-lg bg-[#0d1017] border border-border/90 shadow-2xl z-40 animate-in fade-in-0 zoom-in-95 duration-150 max-h-[380px] overflow-y-auto">
            {/* Quick Type Filter Bar */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/70">
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mr-1">
                  Type:
                </span>
                <button
                  type="button"
                  onClick={() => onSelectType?.("")}
                  className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                    selectedType === ""
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-[#181d2a]"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => onSelectType?.("COMMAND")}
                  className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                    selectedType === "COMMAND"
                      ? "bg-foreground text-background font-semibold"
                      : "text-emerald-400 hover:text-emerald-300 hover:bg-[#181d2a]"
                  }`}
                >
                  <Terminal size={10} />
                  <span>Commands</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectType?.("SNIPPET")}
                  className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                    selectedType === "SNIPPET"
                      ? "bg-foreground text-background font-semibold"
                      : "text-blue-400 hover:text-blue-300 hover:bg-[#181d2a]"
                  }`}
                >
                  <Code size={10} />
                  <span>Snippets</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectType?.("NOTE")}
                  className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                    selectedType === "NOTE"
                      ? "bg-foreground text-background font-semibold"
                      : "text-amber-400 hover:text-amber-300 hover:bg-[#181d2a]"
                  }`}
                >
                  <BookOpen size={10} />
                  <span>Notes</span>
                </button>
              </div>

              <span className="text-[10px] text-muted-foreground font-mono">
                {searchQuery ? `${matchingResults.length} matches` : "Live Filter"}
              </span>
            </div>

            {/* Quick Match Command List */}
            {searchQuery ? (
              matchingResults.length > 0 ? (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
                    Matching Results ({matchingResults.length})
                  </div>
                  {matchingResults.map((entry) => {
                    const isCommand = entry.type === "COMMAND";
                    const isSnippet = entry.type === "SNIPPET";
                    const isCopied = copiedId === entry.id;

                    return (
                      <div
                        key={entry.id}
                        onClick={() => handleJumpToEntry(entry.id)}
                        className="p-2 rounded-md bg-[#111520] hover:bg-[#171d2c] border border-border/60 hover:border-slate-600 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            {isCommand ? (
                              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                                <Terminal size={10} /> cmd
                              </span>
                            ) : isSnippet ? (
                              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 flex items-center gap-1">
                                <Code size={10} /> snippet
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                                <BookOpen size={10} /> note
                              </span>
                            )}
                            <span className="font-semibold text-xs text-foreground truncate">
                              <HighlightedText text={entry.title} query={searchQuery} />
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-slate-300 bg-[#080a0f] p-1.5 rounded border border-border/50 truncate code-visualization-surface">
                            <HighlightedText text={entry.content} query={searchQuery} />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleCopyCommand(e, entry)}
                            className={`h-7 px-2 text-[11px] gap-1 transition-all ${
                              isCopied
                                ? "text-emerald-400 bg-emerald-950/40"
                                : "text-muted-foreground hover:text-foreground hover:bg-[#1e2538]"
                            }`}
                            title="Copy command"
                          >
                            {isCopied ? <Check size={12} /> : <Copy size={12} />}
                            <span className="hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
                          </Button>
                          <ArrowRight size={13} className="text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No matching entries found for &quot;{searchQuery}&quot;. Press <kbd className="search-kbd text-[9px] mx-1">esc</kbd> to clear.
                </div>
              )
            ) : (
              <div className="pt-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-1.5">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>Instant Multi-Field Search</span>
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  Type any keyword to search across commands, titles, code snippets, and tags. Try typing <span className="text-emerald-400 font-mono">docker</span> or <span className="text-emerald-400 font-mono">docker cmds</span> to view all Docker commands.
                </div>
                <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Press <kbd className="search-kbd text-[9px]">⌘K</kbd> to search</span>
                  <span>Press <kbd className="search-kbd text-[9px]">esc</kbd> to exit</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="topbar-actions">
        <TypographyControls />

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
