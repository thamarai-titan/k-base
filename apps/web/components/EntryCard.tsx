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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EntryCardProps {
  entry: Entry;
  onEdit: (entry: Entry) => void;
  onDelete: (id: string, title: string) => void;
  onSelectTag: (tagName: string) => void;
  onNotify: (message: string) => void;
}

export function EntryCard({
  entry,
  onEdit,
  onDelete,
  onSelectTag,
  onNotify,
}: EntryCardProps) {
  const [copied, setCopied] = useState(false);

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

  const renderTypeBadge = () => {
    switch (entry.type) {
      case "COMMAND":
        return (
          <Badge variant="command" className="gap-1 font-mono text-[10px] font-semibold uppercase">
            <Terminal size={11} />
            Command
          </Badge>
        );
      case "SNIPPET":
        return (
          <Badge variant="snippet" className="gap-1 font-mono text-[10px] font-semibold uppercase">
            <Code size={11} />
            Snippet
          </Badge>
        );
      case "NOTE":
        return (
          <Badge variant="note" className="gap-1 font-mono text-[10px] font-semibold uppercase">
            <BookOpen size={11} />
            Note
          </Badge>
        );
    }
  };

  return (
    <Card className="flex flex-col justify-between border-border bg-[#10131b] hover:border-[#2d354b] transition-colors duration-150 group">
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

          <CardTitle className="text-sm font-semibold leading-snug tracking-tight text-[#f5f6f8] group-hover:text-white transition-colors">
            {entry.title}
          </CardTitle>

          {entry.description && (
            <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
              {entry.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="p-4 pt-1 space-y-2.5">
          {entry.type === "NOTE" ? (
            <div className="rounded border border-border/80 bg-[#0c0e15] p-3 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap break-words max-h-48 overflow-y-auto font-sans">
              {entry.content}
            </div>
          ) : (
            <div className="rounded border border-border/80 bg-[#080a0f] overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/80 bg-[#12151e] px-3 py-1.5 text-[11px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5 text-slate-400">
                  {entry.type === "COMMAND" ? (
                    <>
                      <span className="text-emerald-400 font-bold">$</span> bash
                    </>
                  ) : (
                    <>
                      <span className="text-blue-400 font-bold">&lt;/&gt;</span> code
                    </>
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-5 px-1.5 text-[11px] gap-1 transition-all ${
                    copied
                      ? "text-emerald-400 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  onClick={handleCopy}
                >
                  {copied ? <Check size={10} /> : <Copy size={10} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
              <pre className="p-3 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                <code>{entry.content}</code>
              </pre>
            </div>
          )}

          {entry.example && (
            <div className="rounded border-l-2 border-slate-600 bg-[#12151f] p-2 text-xs font-mono text-slate-300">
              <span className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                Example Usage
              </span>
              <span>{entry.example}</span>
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
              #{tag.name}
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
