"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { FilterBar } from "../components/FilterBar";
import { EntryCard } from "../components/EntryCard";
import { EntryModal } from "../components/EntryModal";
import { CategoryModal } from "../components/CategoryModal";
import { Button } from "@/components/ui/button";
import { api, type Category, type Entry, type Tag, type EntryType, type CreateEntryPayload } from "../lib/api";
import { AlertCircle, Plus, BookOpen } from "lucide-react";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedType, setSelectedType] = useState<EntryType | "">("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Modals & State
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Toast notification helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3000);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load Categories & Tags
  const loadMetadata = useCallback(async () => {
    try {
      const [cats, tgs] = await Promise.all([api.getCategories(), api.getTags()]);
      setCategories(cats);
      setTags(tgs);
      const total = cats.reduce((acc, c) => acc + (c._count?.entries || 0), 0);
      setTotalCount(total);
      setApiError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
      }
    }
  }, []);

  // Load Entries based on active filters
  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getEntries({
        search: debouncedSearch,
        category: selectedCategory,
        tag: selectedTag,
        type: selectedType,
      });
      setEntries(data);
      setApiError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedCategory, selectedTag, selectedType]);

  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Handlers for Entry CRUD
  const handleSaveEntry = async (data: CreateEntryPayload, id?: string) => {
    if (id) {
      await api.updateEntry(id, data);
      showToast("Entry updated successfully");
    } else {
      await api.createEntry(data);
      showToast("Entry created successfully");
    }
    await Promise.all([loadMetadata(), loadEntries()]);
  };

  const handleDeleteEntry = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteEntry(id);
      showToast("Entry deleted");
      await Promise.all([loadMetadata(), loadEntries()]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message);
      }
    }
  };

  const handleEditEntry = (entry: Entry) => {
    setEditingEntry(entry);
    setIsEntryModalOpen(true);
  };

  const handleOpenNewEntry = () => {
    setEditingEntry(null);
    setIsEntryModalOpen(true);
  };

  // Handlers for Category CRUD
  const handleCreateCategory = async (data: { name: string; slug?: string }) => {
    await api.createCategory(data);
    showToast(`Category "${data.name}" created`);
    await loadMetadata();
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}" and all its entries?`)) return;
    try {
      await api.deleteCategory(id);
      showToast(`Category "${name}" deleted`);
      if (selectedCategory === id) setSelectedCategory("");
      await Promise.all([loadMetadata(), loadEntries()]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message);
      }
    }
  };

  const selectedCategoryName = categories.find(
    (c) => c.slug === selectedCategory || c.id === selectedCategory
  )?.name;

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar
        categories={categories}
        tags={tags}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        totalEntriesCount={totalCount}
        onSelectCategory={(slug) => {
          startTransition(() => {
            setSelectedCategory(slug);
            setSelectedTag("");
          });
        }}
        onSelectTag={(tag) => {
          startTransition(() => {
            setSelectedTag(tag);
          });
        }}
        onOpenNewCategory={() => setIsCategoryModalOpen(true)}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNewEntry={handleOpenNewEntry}
          onOpenNewCategory={() => setIsCategoryModalOpen(true)}
          selectedType={selectedType}
          onSelectType={(t) => startTransition(() => setSelectedType(t))}
          entries={entries}
          onNotify={showToast}
        />

        <FilterBar
          selectedType={selectedType}
          onSelectType={(t) => startTransition(() => setSelectedType(t))}
          selectedCategory={selectedCategory}
          selectedCategoryName={selectedCategoryName}
          onClearCategory={() => setSelectedCategory("")}
          selectedTag={selectedTag}
          onClearTag={() => setSelectedTag("")}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
          entriesCount={entries.length}
        />

        <main className="content-area">
          {apiError && (
            <div className="mb-4 p-3.5 rounded-md bg-[#1c1810] border border-amber-900/40 text-amber-300 flex items-center gap-2.5 text-xs">
              <AlertCircle size={16} className="shrink-0 text-amber-400" />
              <div>
                <strong className="font-semibold">API Connection Notice:</strong> Ensure your backend is running on{" "}
                <code className="text-amber-200 bg-black/40 px-1 py-0.5 rounded">http://localhost:5001</code>.
                <div className="text-[11px] text-amber-400/70 mt-0.5">
                  Details: {apiError}
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground text-xs font-medium">
              Loading knowledge entries...
            </div>
          ) : entries.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={36} className="text-muted-foreground opacity-50 mb-2" />
              <div className="empty-state-title">No entries found</div>
              <p className="empty-state-desc">
                {selectedCategory || selectedTag || searchQuery || selectedType
                  ? "No knowledge entries match your active filters or search query."
                  : "Your personal knowledge base is empty. Start adding commands, notes, and code snippets!"}
              </p>
              <Button
                variant="default"
                size="default"
                onClick={handleOpenNewEntry}
                className="gap-1.5 font-semibold"
              >
                <Plus size={14} /> Create First Entry
              </Button>
            </div>
          ) : (
            <div className="entries-grid">
              {entries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  searchQuery={searchQuery}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                  onSelectTag={(t) => setSelectedTag(t)}
                  onNotify={showToast}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Entry Modal */}
      <EntryModal
        isOpen={isEntryModalOpen}
        onClose={() => {
          setIsEntryModalOpen(false);
          setEditingEntry(null);
        }}
        categories={categories}
        initialEntry={editingEntry}
        onSubmit={handleSaveEntry}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCreateCategory}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
