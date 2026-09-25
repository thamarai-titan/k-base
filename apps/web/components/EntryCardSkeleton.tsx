"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface EntryCardSkeletonProps {
  variant?: "command" | "snippet" | "note";
}

export function EntryCardSkeleton({ variant = "command" }: EntryCardSkeletonProps) {
  return (
    <Card className="flex flex-col justify-between border-border bg-card shadow-sm select-none">
      <div>
        <CardHeader className="p-4 pb-2.5">
          {/* Top Row: Type Badge + Category Badge + Action Options */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Type Badge with prompt mark */}
              {variant === "command" ? (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5">
                  <span className="text-[10px] font-mono font-bold text-emerald-500/60">&gt;_</span>
                  <Skeleton className="h-3 w-12 bg-emerald-500/20" />
                </div>
              ) : variant === "snippet" ? (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-blue-500/20 bg-blue-500/5">
                  <span className="text-[10px] font-mono font-bold text-blue-500/60">&lt;/&gt;</span>
                  <Skeleton className="h-3 w-11 bg-blue-500/20" />
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/5">
                  <span className="text-[10px] font-mono font-bold text-amber-500/60">📖</span>
                  <Skeleton className="h-3 w-9 bg-amber-500/20" />
                </div>
              )}

              {/* Category Badge */}
              <div className="px-2 py-0.5 rounded border border-border/70 bg-secondary/40">
                <Skeleton className="h-3 w-24 bg-muted-foreground/20" />
              </div>
            </div>

            {/* Three Dots More Menu */}
            <div className="h-6 w-6 rounded flex items-center justify-center">
              <Skeleton className="h-3.5 w-1 rounded-full bg-muted-foreground/30" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5 mt-1">
            <Skeleton className="h-4.5 w-4/5 bg-foreground/15 rounded" />
          </div>

          {/* Description */}
          <div className="space-y-1.5 mt-2">
            <Skeleton className="h-3 w-full bg-muted-foreground/15 rounded" />
            <Skeleton className="h-3 w-2/3 bg-muted-foreground/15 rounded" />
          </div>
        </CardHeader>

        {/* Content Body: Code Terminal or Note Surface */}
        <CardContent className="p-4 pt-1 space-y-2.5">
          {variant === "note" ? (
            <div className="rounded border border-border/80 bg-muted/40 p-3 space-y-2">
              <Skeleton className="h-3.5 w-full bg-muted-foreground/20 rounded" />
              <Skeleton className="h-3.5 w-5/6 bg-muted-foreground/20 rounded" />
              <Skeleton className="h-3.5 w-3/4 bg-muted-foreground/20 rounded" />
              <Skeleton className="h-3.5 w-2/3 bg-muted-foreground/15 rounded" />
            </div>
          ) : (
            <div className="rounded border border-border/80 bg-[var(--surface-code)] overflow-hidden shadow-inner">
              {/* Terminal / Code Box Header */}
              <div className="flex items-center justify-between border-b border-border/70 bg-[var(--surface-code-header)] px-3 py-1.5 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className={variant === "command" ? "text-emerald-500/70 font-bold" : "text-blue-500/70 font-bold"}>
                    {variant === "command" ? "$" : "</>"}
                  </span>
                  <Skeleton className="h-3 w-8 bg-muted-foreground/25" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded bg-muted-foreground/20" />
                  <Skeleton className="h-3 w-7 bg-muted-foreground/20" />
                </div>
              </div>

              {/* Code Pre Area with Command Line Skeleton */}
              <div className="p-3 space-y-2 font-mono">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3/4 bg-foreground/20 rounded" />
                </div>
                {variant === "snippet" && (
                  <>
                    <Skeleton className="h-3 w-1/2 bg-foreground/15 rounded" />
                    <Skeleton className="h-3 w-2/3 bg-foreground/15 rounded" />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Example Usage Box */}
          {variant !== "note" && (
            <div className="rounded border-l-2 border-border bg-[var(--surface-example)] p-2 space-y-1.5">
              <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted-foreground/60">
                EXAMPLE USAGE
              </div>
              <Skeleton className="h-3 w-3/5 bg-foreground/15 rounded font-mono" />
            </div>
          )}
        </CardContent>
      </div>

      {/* Footer Tag Badges */}
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-1.5 border-t border-border/50 mt-2.5 pt-2.5">
        <div className="px-2 py-0.5 rounded border border-border bg-secondary/50 flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground/50 font-mono">#</span>
          <Skeleton className="h-2.5 w-12 bg-muted-foreground/25" />
        </div>
        <div className="px-2 py-0.5 rounded border border-border bg-secondary/50 flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground/50 font-mono">#</span>
          <Skeleton className="h-2.5 w-14 bg-muted-foreground/25" />
        </div>
        <div className="px-2 py-0.5 rounded border border-border bg-secondary/50 flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground/50 font-mono">#</span>
          <Skeleton className="h-2.5 w-10 bg-muted-foreground/25" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function EntryGridSkeleton({ count = 6 }: { count?: number }) {
  const variants: ("command" | "snippet" | "note")[] = [
    "command",
    "command",
    "command",
    "snippet",
    "note",
    "command",
  ];

  return (
    <div className="entries-grid">
      {Array.from({ length: count }).map((_, index) => (
        <EntryCardSkeleton
          key={index}
          variant={variants[index % variants.length]}
        />
      ))}
    </div>
  );
}
