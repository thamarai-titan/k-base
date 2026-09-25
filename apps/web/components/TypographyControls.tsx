"use client";

import React, { useEffect, useState } from "react";
import { Type, Check, BookOpen, SlidersHorizontal, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FontPair =
  | "inter"
  | "geist"
  | "jakarta"
  | "ibm-plex"
  | "roboto"
  | "source"
  | "lexend"
  | "manrope"
  | "system"
  | "editorial";

export type ReadingMode = "comfortable" | "compact";

interface FontOption {
  id: FontPair;
  name: string;
  shortName: string;
  uiFont: string;
  codeFont: string;
  usedBy: string;
  description: string;
  badge?: string;
}

const FONT_OPTIONS: FontOption[] = [
  {
    id: "inter",
    name: "Inter + JetBrains Mono",
    shortName: "Inter",
    uiFont: "Inter Variable",
    codeFont: "JetBrains Mono",
    usedBy: "Figma, Linear, GitHub, Supabase",
    description: "Industry gold standard for digital UI & code legibility",
    badge: "Recommended",
  },
  {
    id: "geist",
    name: "Geist Sans + Mono",
    shortName: "Geist",
    uiFont: "Geist Sans",
    codeFont: "Geist Mono",
    usedBy: "Vercel, Next.js, AI Dev Tools",
    description: "Modern minimalist developer aesthetic engineered by Vercel",
    badge: "Modern",
  },
  {
    id: "ibm-plex",
    name: "IBM Plex Sans + Mono",
    shortName: "IBM Plex",
    uiFont: "IBM Plex Sans",
    codeFont: "IBM Plex Mono",
    usedBy: "IBM Carbon, Hacker News Tools, Stripe Specs",
    description: "Engineered for technical reading with unambiguous characters (0, O, 1, l, I)",
    badge: "Technical",
  },
  {
    id: "roboto",
    name: "Roboto + Roboto Mono",
    shortName: "Roboto",
    uiFont: "Roboto",
    codeFont: "Roboto Mono",
    usedBy: "Google, Android, YouTube, Cloud Console",
    description: "Google's signature neutral neo-grotesque design across screens",
    badge: "Google",
  },
  {
    id: "jakarta",
    name: "Plus Jakarta + Fira Code",
    shortName: "Jakarta",
    uiFont: "Plus Jakarta Sans",
    codeFont: "Fira Code",
    usedBy: "Modern SaaS, Raycast, Tech Startups",
    description: "Contemporary geometry with rich coding ligatures (=>, !==)",
  },
  {
    id: "source",
    name: "Source Sans 3 + Code",
    shortName: "Source",
    uiFont: "Source Sans 3",
    codeFont: "Source Code Pro",
    usedBy: "Adobe, Wikipedia, Mozilla Docs",
    description: "Legendary open-source font crafted specifically for long documentation",
    badge: "Docs",
  },
  {
    id: "lexend",
    name: "Lexend + JetBrains Mono",
    shortName: "Lexend",
    uiFont: "Lexend",
    codeFont: "JetBrains Mono",
    usedBy: "Educational Platforms, Speed-Reading Apps",
    description: "Scientifically engineered typography to reduce visual crowding & fatigue",
    badge: "Focus",
  },
  {
    id: "manrope",
    name: "Manrope + JetBrains Mono",
    shortName: "Manrope",
    uiFont: "Manrope",
    codeFont: "JetBrains Mono",
    usedBy: "Fintech, Web3, Creative Portals",
    description: "Semi-geometric modernist sans with open apertures for razor-sharp clarity",
  },
  {
    id: "system",
    name: "System Native (OS UI)",
    shortName: "System",
    uiFont: "SF Pro / Segoe UI",
    codeFont: "Native Monospace",
    usedBy: "Apple Developer, GitHub Native UI, macOS",
    description: "Zero webfont overhead using your operating system's native typography engine",
    badge: "Fastest",
  },
  {
    id: "editorial",
    name: "Merriweather Serif + Code",
    shortName: "Editorial",
    uiFont: "Merriweather Serif",
    codeFont: "JetBrains Mono",
    usedBy: "Substack, Medium, Long-form Tech Essays",
    description: "Warm, editorial reading serif designed for extended long-form technical essays",
    badge: "Long-form",
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
          className="h-8 w-[148px] justify-between px-2.5 text-xs bg-card border-border hover:bg-secondary hover:text-foreground text-foreground shrink-0 select-none"
          title="Change reading font and visual typography"
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            <Type size={13} className="text-muted-foreground shrink-0" />
            <span className="truncate font-medium text-left">
              {mounted ? (currentOption?.shortName || "Font") : "Font"}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono px-1 py-0.5 rounded bg-muted border border-border text-muted-foreground shrink-0 ml-1.5">
            {mounted && readingMode === "comfortable" ? "Comf" : "Comp"}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-88 sm:w-96 p-2 bg-popover border-border shadow-2xl">
        <DropdownMenuLabel className="px-2 py-1 text-xs font-semibold text-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal size={13} className="text-muted-foreground" />
            <span>Typography & Reading Mode</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">Real-time</span>
        </DropdownMenuLabel>

        <div className="px-2 py-1 text-[11px] text-muted-foreground">
          Curated readable font pairings from popular sites and documentation systems.
        </div>

        <DropdownMenuSeparator className="my-1.5 bg-border/80" />

        {/* Font Pair Selection - Scrollable List */}
        <div className="max-h-[380px] overflow-y-auto pr-1 space-y-1">
          {FONT_OPTIONS.map((opt) => {
            const isSelected = activeFont === opt.id;
            return (
              <DropdownMenuItem
                key={opt.id}
                onClick={() => handleSelectFont(opt.id)}
                className={`p-2 rounded-md cursor-pointer transition-all flex flex-col items-start gap-1 ${
                  isSelected
                    ? "bg-secondary border border-border text-foreground font-medium"
                    : "hover:bg-secondary/60 text-foreground border border-transparent"
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

                {/* Popular Sites Tag */}
                <div className="flex items-center gap-1 text-[10px] text-cyan-500 font-mono">
                  <Globe size={10} className="shrink-0 text-cyan-500" />
                  <span className="truncate">{opt.usedBy}</span>
                </div>

                <div className="text-[11px] text-muted-foreground leading-snug">
                  {opt.description}
                </div>

                <div className="w-full mt-0.5 pt-1 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                  <span>UI: {opt.uiFont}</span>
                  <span className="text-emerald-500">Code: {opt.codeFont}</span>
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

          <div className="grid grid-cols-2 gap-1.5 bg-muted/40 p-1 rounded-md border border-border">
            <button
              type="button"
              onClick={() => handleSelectReadingMode("comfortable")}
              className={`py-1.5 px-2 rounded text-[11px] font-medium transition-all ${
                readingMode === "comfortable"
                  ? "bg-card text-foreground border border-border shadow-sm font-semibold"
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
                  ? "bg-card text-foreground border border-border shadow-sm font-semibold"
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
