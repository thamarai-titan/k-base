"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  confirmText?: string;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  confirmText = "Delete",
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-md border-border bg-card shadow-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-full bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="font-mono text-xs uppercase tracking-wider text-destructive font-semibold">
              Confirm Deletion
            </span>
          </div>
          <AlertDialogTitle className="text-base font-bold text-foreground pt-1">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs leading-relaxed text-muted-foreground pt-1">
            {description}
            {itemName && (
              <span className="block mt-2.5 font-mono text-[11px] p-2 rounded bg-muted/60 border border-border/70 text-foreground truncate">
                {itemName}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-3 pt-3 border-t border-border/50">
          <AlertDialogCancel
            disabled={isDeleting}
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{isDeleting ? "Deleting..." : confirmText}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
