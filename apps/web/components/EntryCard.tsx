"use client";

import React, { useState } from "react";
import { Copy, Check, Edit2, Trash2, Terminal, BookOpen, Code } from "lucide-react";
import type { Entry } from "../lib/api";

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

  const renderTypeIcon = () => {
    switch (entry.type) {
      case "COMMAND":
        return <Terminal size={12} style={{ marginRight: "4px" }} />;
      case "NOTE":
        return <BookOpen size={12} style={{ marginRight: "4px" }} />;
      case "SNIPPET":
        return <Code size={12} style={{ marginRight: "4px" }} />;
    }
  };

  return (
    <article className="entry-card">
      <div className="entry-header">
        <div className="entry-meta">
          <span className={`entry-type-badge type-${entry.type}`}>
            {renderTypeIcon()}
            {entry.type}
          </span>
          {entry.category && (
            <span className="entry-category-chip">{entry.category.name}</span>
          )}
        </div>

        <div className="entry-actions">
          <button
            className="icon-btn"
            title="Edit entry"
            onClick={() => onEdit(entry)}
          >
            <Edit2 size={15} />
          </button>
          <button
            className="icon-btn danger"
            title="Delete entry"
            onClick={() => onDelete(entry.id, entry.title)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <h3 className="entry-title">{entry.title}</h3>

      {entry.description && (
        <p className="entry-description">{entry.description}</p>
      )}

      {entry.type === "NOTE" ? (
        <div className="note-content-box">{entry.content}</div>
      ) : (
        <div className="terminal-box">
          <div className="terminal-box-header">
            <span>{entry.type === "COMMAND" ? "$ bash" : "</> snippet"}</span>
            <button
              className={`copy-btn ${copied ? "copied" : ""}`}
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
          <pre className="terminal-content">
            <code>{entry.content}</code>
          </pre>
        </div>
      )}

      {entry.example && (
        <div className="example-box">
          <span className="example-title">Example / Usage:</span>
          <span>{entry.example}</span>
        </div>
      )}

      {entry.tags && entry.tags.length > 0 && (
        <div className="entry-tags">
          {entry.tags.map((tag) => (
            <button
              key={tag.id}
              className="entry-tag-pill"
              onClick={() => onSelectTag(tag.name)}
              title={`Filter by tag #${tag.name}`}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
