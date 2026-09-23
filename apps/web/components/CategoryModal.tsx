"use client";

import React, { useState } from "react";
import { FolderPlus } from "lucide-react";
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

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; slug?: string }) => Promise<void>;
}

export function CategoryModal({ isOpen, onClose, onSubmit }: CategoryModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(autoSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({ name: name.trim(), slug: slug.trim() || undefined });
      setName("");
      setSlug("");
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create category");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#0f121a] border-border">
        <DialogHeader>
          <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-xs uppercase tracking-wider">
            <FolderPlus size={13} />
            <span>Taxonomy</span>
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            Create Category
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Group knowledge entries by domain, tech stack, or workflow.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          {error && (
            <div className="p-2.5 rounded bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Category Name *
            </label>
            <Input
              type="text"
              placeholder="e.g. Kubernetes, AWS, PostgreSQL, CI/CD"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              autoFocus
              className="bg-[#141722]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Slug (URL-friendly identifier)
            </label>
            <Input
              type="text"
              placeholder="e.g. kubernetes, aws, postgresql"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-[#141722] font-mono text-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              Auto-generated from name if left untouched
            </p>
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
              {isSubmitting ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
