"use client";

import React, { useState, useEffect } from "react";
import { Terminal, BookOpen, Code, Database } from "lucide-react";
import type { Category, Entry, EntryType, CreateEntryPayload } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialEntry?: Entry | null;
  onSubmit: (data: CreateEntryPayload, id?: string) => Promise<void>;
}

export function EntryModal({
  isOpen,
  onClose,
  categories,
  initialEntry,
  onSubmit,
}: EntryModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EntryType>("COMMAND");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [example, setExample] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEntry) {
      setTitle(initialEntry.title);
      setType(initialEntry.type);
      setCategoryId(initialEntry.categoryId);
      setContent(initialEntry.content);
      setDescription(initialEntry.description || "");
      setExample(initialEntry.example || "");
      setTagsInput(initialEntry.tags ? initialEntry.tags.map((t) => t.name).join(", ") : "");
    } else {
      setTitle("");
      setType("COMMAND");
      setCategoryId(categories.length > 0 ? categories[0]!.id : "");
      setContent("");
      setDescription("");
      setExample("");
      setTagsInput("");
    }
    setError(null);
  }, [initialEntry, categories, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim()) {
      setError("Content is required");
      return;
    }
    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(
        {
          title: title.trim(),
          type,
          categoryId,
          content: content.trim(),
          description: description.trim() || null,
          example: example.trim() || null,
          tags,
        },
        initialEntry?.id
      );
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-[#0f121a] border-border">
        <DialogHeader>
          <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-xs uppercase tracking-wider">
            <Database size={13} />
            <span>Knowledge Base Entry</span>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            {initialEntry ? "Edit Knowledge Entry" : "New Knowledge Entry"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Save reusable terminal commands, code snippets, or architecture notes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          {error && (
            <div className="p-2.5 rounded bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Type Selector Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Entry Type
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#151824] p-1 rounded-md border border-border">
              <button
                type="button"
                onClick={() => setType("COMMAND")}
                className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded text-xs transition-all ${
                  type === "COMMAND"
                    ? "bg-foreground text-background font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Terminal size={13} />
                <span>Command</span>
              </button>
              <button
                type="button"
                onClick={() => setType("SNIPPET")}
                className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded text-xs transition-all ${
                  type === "SNIPPET"
                    ? "bg-foreground text-background font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code size={13} />
                <span>Snippet</span>
              </button>
              <button
                type="button"
                onClick={() => setType("NOTE")}
                className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded text-xs transition-all ${
                  type === "NOTE"
                    ? "bg-foreground text-background font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen size={13} />
                <span>Note</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Title *
            </label>
            <Input
              type="text"
              placeholder="e.g. Docker prune dangling images and volumes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-[#141722]"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Category *
            </label>
            <select
              className="flex h-8 w-full rounded-md border border-input bg-[#141722] px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.length === 0 && <option value="">No categories available</option>}
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0f121a] text-foreground">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Content *{" "}
              <span className="text-[11px] text-muted-foreground font-normal">
                {type === "COMMAND"
                  ? "(Shell command)"
                  : type === "SNIPPET"
                  ? "(Code block)"
                  : "(Knowledge notes)"}
              </span>
            </label>
            <Textarea
              className={`min-h-[120px] bg-[#141722] leading-relaxed transition-all ${
                type === "NOTE"
                  ? "note-reading-surface font-reading text-sm"
                  : "code-visualization-surface font-code text-xs"
              }`}
              placeholder={
                type === "COMMAND"
                  ? "docker system prune -a --volumes -f"
                  : type === "SNIPPET"
                  ? "const config = { ... }"
                  : "Key architectural decision or notes..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Description <span className="text-[11px] text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              className="min-h-[55px] bg-[#141722] text-xs font-sans"
              placeholder="Brief explanation of when and why to use this..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Example / Usage */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Example Usage <span className="text-[11px] text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. docker run -d -p 8080:80 nginx"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              className="bg-[#141722] font-mono text-xs"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Tags <span className="text-[11px] text-muted-foreground font-normal">(comma-separated)</span>
            </label>
            <Input
              type="text"
              placeholder="docker, cleanup, containers, devops"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="bg-[#141722] text-xs"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-border gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : initialEntry ? "Save Changes" : "Create Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
