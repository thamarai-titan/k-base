export type EntryType = "COMMAND" | "NOTE" | "SNIPPET";

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count?: {
    entries: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  _count?: {
    entries: number;
  };
}

export interface Entry {
  id: string;
  title: string;
  type: EntryType;
  content: string;
  description: string | null;
  example: string | null;
  categoryId: string;
  category?: Category;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryPayload {
  title: string;
  type: EntryType;
  content: string;
  description?: string | null;
  example?: string | null;
  categoryId: string;
  tags?: string[];
}

export interface UpdateEntryPayload {
  title?: string;
  type?: EntryType;
  content?: string;
  description?: string | null;
  example?: string | null;
  categoryId?: string;
  tags?: string[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return null as unknown as T;
  }

  return res.json();
}

export const api = {
  // Categories
  async getCategories(): Promise<Category[]> {
    return fetchJson<Category[]>(`${API_BASE}/categories`);
  },

  async createCategory(data: { name: string; slug?: string }): Promise<Category> {
    return fetchJson<Category>(`${API_BASE}/categories`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id: string): Promise<void> {
    return fetchJson<void>(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
    });
  },

  // Entries
  async getEntries(params?: {
    search?: string;
    category?: string;
    tag?: string;
    type?: EntryType | "";
  }): Promise<Entry[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.category) query.set("category", params.category);
    if (params?.tag) query.set("tag", params.tag);
    if (params?.type) query.set("type", params.type);

    const qs = query.toString();
    const url = `${API_BASE}/entries${qs ? `?${qs}` : ""}`;
    return fetchJson<Entry[]>(url);
  },

  async getEntry(id: string): Promise<Entry> {
    return fetchJson<Entry>(`${API_BASE}/entries/${id}`);
  },

  async createEntry(data: CreateEntryPayload): Promise<Entry> {
    return fetchJson<Entry>(`${API_BASE}/entries`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateEntry(id: string, data: UpdateEntryPayload): Promise<Entry> {
    return fetchJson<Entry>(`${API_BASE}/entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteEntry(id: string): Promise<void> {
    return fetchJson<void>(`${API_BASE}/entries/${id}`, {
      method: "DELETE",
    });
  },

  // Tags
  async getTags(): Promise<Tag[]> {
    return fetchJson<Tag[]>(`${API_BASE}/tags`);
  },

  async deleteTag(id: string): Promise<void> {
    return fetchJson<void>(`${API_BASE}/tags/${id}`, {
      method: "DELETE",
    });
  },
};
