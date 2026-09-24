"use client";

import React from "react";

interface HighlightedTextProps {
  text: string;
  query?: string;
  className?: string;
}

export function HighlightedText({ text, query, className }: HighlightedTextProps) {
  if (!query || !query.trim() || !text) {
    return <span className={className}>{text}</span>;
  }

  // Extract clean search terms (remove cmd: or type keywords)
  const terms = query
    .trim()
    .split(/\s+/)
    .map((t) => t.replace(/^(cmds?|commands?|notes?|snippets?|code):?/i, "").trim())
    .filter((t) => t.length > 0);

  if (terms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  try {
    const escaped = terms.map((t) => t.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);

    return (
      <span className={className}>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="bg-amber-500/20 text-amber-200 px-1 py-0.5 rounded border border-amber-500/35 font-semibold"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  } catch {
    return <span className={className}>{text}</span>;
  }
}
