"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ThemeMode = "dark" | "light" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  const applyTheme = (targetTheme: ThemeMode) => {
    let resolvedTheme: "dark" | "light" = "dark";
    if (targetTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      resolvedTheme = prefersDark ? "dark" : "light";
    } else {
      resolvedTheme = targetTheme;
    }

    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  };

  useEffect(() => {
    setMounted(true);
    const storedTheme = (localStorage.getItem("kbase_theme") as ThemeMode) || "dark";
    setTheme(storedTheme);
    applyTheme(storedTheme);

    // Listen for system theme changes if set to system
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const current = localStorage.getItem("kbase_theme");
      if (current === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const handleSelectTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem("kbase_theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-[84px] justify-center gap-1.5 px-2 text-xs bg-card border-border hover:bg-secondary hover:text-foreground text-foreground shrink-0 select-none"
          title="Toggle Light / Dark theme"
        >
          {mounted ? (
            theme === "light" ? (
              <Sun size={13} className="text-amber-500 shrink-0 transition-transform duration-200 rotate-0" />
            ) : theme === "system" ? (
              <Laptop size={13} className="text-blue-400 shrink-0" />
            ) : (
              <Moon size={13} className="text-cyan-400 shrink-0 transition-transform duration-200" />
            )
          ) : (
            <Moon size={13} className="text-muted-foreground shrink-0" />
          )}
          <span className="font-medium capitalize truncate">
            {mounted ? theme : "Theme"}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 p-1.5 bg-popover border-border shadow-2xl">
        <DropdownMenuLabel className="px-2 py-1 text-xs font-semibold text-foreground flex items-center justify-between">
          <span>Appearance</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-border/80" />

        <DropdownMenuItem
          onClick={() => handleSelectTheme("dark")}
          className={`px-2 py-1.5 rounded text-xs cursor-pointer flex items-center justify-between ${
            theme === "dark" ? "bg-secondary text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Moon size={13} className="text-cyan-400" />
            <span>Dark</span>
          </div>
          {theme === "dark" && <Check size={13} className="text-emerald-400" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleSelectTheme("light")}
          className={`px-2 py-1.5 rounded text-xs cursor-pointer flex items-center justify-between ${
            theme === "light" ? "bg-secondary text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Sun size={13} className="text-amber-500" />
            <span>Light</span>
          </div>
          {theme === "light" && <Check size={13} className="text-emerald-400" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleSelectTheme("system")}
          className={`px-2 py-1.5 rounded text-xs cursor-pointer flex items-center justify-between ${
            theme === "system" ? "bg-secondary text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Laptop size={13} className="text-blue-400" />
            <span>System</span>
          </div>
          {theme === "system" && <Check size={13} className="text-emerald-400" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
