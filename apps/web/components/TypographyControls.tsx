"use client";

import React, { useEffect, useState } from "react";
import { Type, Check, Sparkles, BookOpen, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FontPair = "inter" | "geist" | "jakarta";
export type ReadingMode = "comfortable" | "compact";

interface FontOption {
  id: FontPair;
  name: string;
  uiFont: string;
  codeFont: string;
  description: string;
  badge?: string;
}

const FONT_OPTIONS: FontOption[] = [
  {
    id: "inter",
    name: "Inter + JetBrains Mono",
    uiFont: "Inter Variable",
    codeFont: "JetBrains Mono",
    description: "Industry gold-standard for screen reading & code legibility",
    badge: "Recommended",
  },
  {
    id: "geist",
    name: "Geist Sans + Mono",
    uiFont: "Geist Sans",
    codeFont: "Geist Mono",
    description: "Modern minimalist tech aesthetic engineered by Vercel",
  },
  {
    id: "jakarta",
    name: "Jakarta + Fira Code",
    uiFont: "Plus Jakarta Sans",
    codeFont: "Fira Code",
    description: "Editorial geometry with rich coding ligatures (=>, !==)",
  },
];

export function TypographyControls() {
  const [activeFont, setActiveFont] = useState<FontPair>("inter");
  const [readingMode, setReadingMode] = useState<ReadingMode>("comfortable");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedFont = (localStorage.getItem("kbase_font_pair") as FontPair) || "inter";
    const storedDensity = (localStorage.getItem("kbase_reading_density") as ReadingMode) || "comfortable";

    setActiveFont(storedFont);
    setReadingMode(storedDensity);

    document.documentElement.setAttribute("data-font", storedFont);
    document.documentElement.setAttribute("data-reading-mode", storedDensity);
  }, []);

  const handleSelectFont = (font: FontPair) => {
    setActiveFont(font);
    localStorage.setItem("kbase_font_pair", font);
    document.documentElement.setAttribute("data-font", font);
  };

  const handleSelectReadingMode = (mode: ReadingMode) => {
    setReadingMode(mode);
    localStorage.setItem("kbase_reading_density", mode);
    document.documentElement.setAttribute("data-reading-mode", mode);
  };

  const currentOption = FONT_OPTIONS.find((f) => f.id === activeFont) || FONT_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 px-2.5 text-xs bg-[#10131b] border-border hover:bg-[#151924] hover:text-foreground text-slate-300"
          title="Change reading font and visual typography"
        >
          <Type size={13} className="text-slate-400" />
          <span className="hidden sm:inline font-medium">
            {mounted ? (activeFont === "inter" ? "Inter" : activeFont === "geist" ? "Geist" : "Jakarta") : "Font"}
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#171b26] border border-border text-muted-foreground hidden md:inline">
            {mounted && readingMode === "comfortable" ? "Comfort" : "Compact"}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-2 bg-[#0c0f17] border-border shadow-2xl">
        <DropdownMenuLabel className="px-2 py-1 text-xs font-semibold text-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal size={13} className="text-muted-foreground" />
            <span>Typography & Reading Mode</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">Real-time</span>
        </DropdownMenuLabel>

        <div className="px-2 py-1 text-[11px] text-muted-foreground">
          Select typography tailored for reading notes and visualizing code.
        </div>

        <DropdownMenuSeparator className="my-1.5 bg-border/80" />

        {/* Font Pair Selection */}
        <div className="space-y-1">
          {FONT_OPTIONS.map((opt) => {
            const isSelected = activeFont === opt.id;
            return (
              <DropdownMenuItem
                key={opt.id}
                onClick={() => handleSelectFont(opt.id)}
                className={`p-2 rounded-md cursor-pointer transition-all flex flex-col items-start gap-1 ${
                  isSelected
                    ? "bg-[#181d2a] border border-[#2d374f] text-foreground"
                    : "hover:bg-[#121622] text-slate-300 border border-transparent"
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs tracking-tight">{opt.name}</span>
                    {opt.badge && (
                      <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check size={14} className="text-emerald-400 shrink-0" />}
                </div>

                <div className="text-[11px] text-muted-foreground leading-snug">
                  {opt.description}
                </div>

                <div className="w-full mt-1 pt-1 border-t border-border/40 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>UI: {opt.uiFont}</span>
                  <span className="text-emerald-400/90">Code: {opt.codeFont}</span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="my-2 bg-border/80" />

        {/* Reading Density Toggle */}
        <div className="px-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold mb-1.5">
            <span className="flex items-center gap-1.5">
              <BookOpen size={12} />
              <span>Note Reading Density</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 bg-[#121520] p-1 rounded-md border border-border">
            <button
              type="button"
              onClick={() => handleSelectReadingMode("comfortable")}
              className={`py-1.5 px-2 rounded text-[11px] font-medium transition-all ${
                readingMode === "comfortable"
                  ? "bg-[#1c2233] text-foreground border border-[#313c59] shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Comfortable (14px)
            </button>
            <button
              type="button"
              onClick={() => handleSelectReadingMode("compact")}
              className={`py-1.5 px-2 rounded text-[11px] font-medium transition-all ${
                readingMode === "compact"
                  ? "bg-[#1c2233] text-foreground border border-[#313c59] shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Compact (13px)
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
