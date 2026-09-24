"use client";

import React, { useState } from "react";
import { Copy, Check, Edit2, Trash2, Terminal, BookOpen, Code, MoreVertical } from "lucide-react";
import type { Entry } from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HighlightedText } from "./HighlightedText";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EntryCardProps {
  entry: Entry;
  searchQuery?: string;
  onEdit: (entry: Entry) => void;
  onDelete: (id: string, title: string) => void;
  onSelectTag: (tagName: string) => void;
  onNotify: (message: string) => void;
}

export function EntryCard({
  entry,
  searchQuery,
  onEdit,
  onDelete,
  onSelectTag,
  onNotify,
}: EntryCardProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(entry.content);
      setCopied(true);
      onNotify("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onNotify("Failed to copy to clipboard");
    }
  };

  const isLongContent = entry.content.length > 220 || entry.content.split("\n").length > 5;

  const renderTypeBadge = () => {
    switch (entry.type) {
      case "COMMAND":
        return (
          <Badge variant="command" className="gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider">
            <Terminal size={11} />
            Command
          </Badge>
        );
      case "SNIPPET":
        return (
          <Badge variant="snippet" className="gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider">
            <Code size={11} />
            Snippet
          </Badge>
        );
      case "NOTE":
        return (
          <Badge variant="note" className="gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider">
            <BookOpen size={11} />
            Note
          </Badge>
        );
    }
  };

  return (
    <Card id={`entry-${entry.id}`} className="flex flex-col justify-between border-border bg-[#10131b] hover:border-[#2d354b] transition-all duration-150 group">
      <div>
        <CardHeader className="p-4 pb-2.5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {renderTypeBadge()}
              {entry.category && (
                <Badge
                  variant="outline"
                  className="bg-[#141723] text-muted-foreground border-border text-[10px]"
                >
                  {entry.category.name}
                </Badge>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="iconSm"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100"
                >
                  <MoreVertical size={13} />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 bg-[#0e1119] border-border text-xs">
                <DropdownMenuItem onClick={() => onEdit(entry)} className="gap-2 cursor-pointer">
                  <Edit2 size={12} className="text-muted-foreground" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy} className="gap-2 cursor-pointer">
                  <Copy size={12} className="text-muted-foreground" />
                  <span>Copy</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={() => onDelete(entry.id, entry.title)}
                  className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardTitle className="text-[14.5px] font-semibold leading-snug tracking-tight text-[#f5f6f8] group-hover:text-white transition-colors">
            <HighlightedText text={entry.title} query={searchQuery} />
          </CardTitle>

          {entry.description && (
            <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
              <HighlightedText text={entry.description} query={searchQuery} />
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="p-4 pt-1 space-y-2.5">
          {entry.type === "NOTE" ? (
            <div className="relative rounded border border-border/80 bg-[#0c0f18] p-3 text-slate-200">
              <div
                className={`note-reading-surface whitespace-pre-wrap break-words transition-all ${
                  !isExpanded && isLongContent ? "line-clamp-6" : ""
                }`}
              >
                <HighlightedText text={entry.content} query={searchQuery} />
              </div>

              {isLongContent && (
                <div className="mt-2 pt-2 border-t border-border/50 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    {isExpanded ? "Collapse Reading View ↑" : "Expand Full Note ↓"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded border border-border/80 bg-[#07090e] overflow-hidden shadow-inner">
              <div className="flex items-center justify-between border-b border-border/70 bg-[#10131c] px-3 py-1.5 text-[11px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5 text-slate-400">
                  {entry.type === "COMMAND" ? (
                    <>
                      <span className="text-emerald-400 font-bold">$</span>
                      <span className="text-slate-300 font-medium">bash</span>
                    </>
                  ) : (
                    <>
                      <span className="text-blue-400 font-bold">&lt;/&gt;</span>
                      <span className="text-slate-300 font-medium">code</span>
                    </>
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-5 px-2 text-[11px] gap-1 transition-all ${
                    copied
                      ? "text-emerald-400 font-medium bg-emerald-950/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  onClick={handleCopy}
                >
                  {copied ? <Check size={10} /> : <Copy size={10} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
              <pre className="p-3 text-[12px] text-slate-200 overflow-x-auto whitespace-pre-wrap break-all code-visualization-surface">
                <code>
                  <HighlightedText text={entry.content} query={searchQuery} />
                </code>
              </pre>
            </div>
          )}

          {entry.example && (
            <div className="rounded border-l-2 border-slate-600 bg-[#111420] p-2 text-xs code-visualization-surface text-slate-300">
              <span className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                Example Usage
              </span>
              <span>
                <HighlightedText text={entry.example} query={searchQuery} />
              </span>
            </div>
          )}
        </CardContent>
      </div>

      {entry.tags && entry.tags.length > 0 && (
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-1 border-t border-border/50 mt-2.5 pt-2.5">
          {entry.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="tag"
              onClick={() => onSelectTag(tag.name)}
              className="text-[10px] py-0 px-1.5 transition-colors hover:border-[#353d54] hover:text-foreground"
            >
              #<HighlightedText text={tag.name} query={searchQuery} />
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
