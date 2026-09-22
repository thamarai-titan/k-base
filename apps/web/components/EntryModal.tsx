"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Category, Entry, EntryType, CreateEntryPayload } from "../lib/api";

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

  if (!isOpen) return null;

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {initialEntry ? "Edit Knowledge Entry" : "Create Knowledge Entry"}
          </h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div className="modal-body">
            {error && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", fontSize: "0.85rem" }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Docker prune dangling images"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value as EntryType)}
                >
                  <option value="COMMAND">Command</option>
                  <option value="NOTE">Note</option>
                  <option value="SNIPPET">Snippet</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  {categories.length === 0 && <option value="">No categories available</option>}
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Content * {type === "COMMAND" ? "(Command string)" : type === "SNIPPET" ? "(Code snippet)" : "(Note content)"}
              </label>
              <textarea
                className="form-textarea"
                style={{ fontFamily: type !== "NOTE" ? "var(--font-mono)" : "var(--font-sans)", minHeight: "110px" }}
                placeholder={type === "COMMAND" ? "git status -s" : "Enter knowledge content..."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Brief explanation of when and why to use this..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ minHeight: "65px" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Example / Usage (optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. docker run -d -p 80:80 nginx:alpine"
                value={example}
                onChange={(e) => setExample(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. docker, containers, cleanup"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialEntry ? "Save Changes" : "Create Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
