import { prisma, type Prisma } from "@repo/database";
import type { CreateEntryInput, UpdateEntryInput, EntryQueryInput } from "./entries.dto.js";

export class EntriesService {
  async findAll(query: EntryQueryInput) {
    const andClauses: Prisma.EntryWhereInput[] = [];

    let targetType = query.type;
    let searchStr = query.search ? query.search.trim() : "";

    // 1. Parse type intents from search string (e.g. "cmd:docker", "docker cmds", "cmds docker", "docker commands")
    if (searchStr) {
      const cmdPrefixMatch = searchStr.match(/^(?:cmd|command|cmds):\s*(.*)$/i);
      const notePrefixMatch = searchStr.match(/^(?:note|notes):\s*(.*)$/i);
      const snippetPrefixMatch = searchStr.match(/^(?:snippet|snippets|code):\s*(.*)$/i);

      if (cmdPrefixMatch) {
        targetType = "COMMAND";
        searchStr = cmdPrefixMatch[1]?.trim() || "";
      } else if (notePrefixMatch) {
        targetType = "NOTE";
        searchStr = notePrefixMatch[1]?.trim() || "";
      } else if (snippetPrefixMatch) {
        targetType = "SNIPPET";
        searchStr = snippetPrefixMatch[1]?.trim() || "";
      } else if (!targetType) {
        // Check for words like "cmd", "cmds", "command", "commands"
        const words = searchStr.split(/\s+/);
        const hasCmdWord = words.some((w) => /^(cmds?|commands?)$/i.test(w));
        if (hasCmdWord && words.length > 1) {
          targetType = "COMMAND";
          searchStr = words.filter((w) => !/^(cmds?|commands?)$/i.test(w)).join(" ");
        }
      }
    }

    // Filter by type
    if (targetType) {
      andClauses.push({ type: targetType });
    }

    // Filter by Category (by ID or Slug or Name)
    if (query.category) {
      andClauses.push({
        OR: [
          { categoryId: query.category },
          { category: { slug: query.category } },
          { category: { name: { equals: query.category, mode: "insensitive" } } },
        ],
      });
    }

    // Filter by Tag
    if (query.tag) {
      andClauses.push({
        tags: {
          some: {
            name: { equals: query.tag, mode: "insensitive" },
          },
        },
      });
    }

    // Search query across title, command/content, description, example, category, and tags
    if (searchStr) {
      const terms = searchStr.split(/\s+/).filter(Boolean);
      for (const term of terms) {
        andClauses.push({
          OR: [
            { title: { contains: term, mode: "insensitive" } },
            { content: { contains: term, mode: "insensitive" } },
            { description: { contains: term, mode: "insensitive" } },
            { example: { contains: term, mode: "insensitive" } },
            { category: { name: { contains: term, mode: "insensitive" } } },
            { tags: { some: { name: { contains: term, mode: "insensitive" } } } },
          ],
        });
      }
    }

    const where: Prisma.EntryWhereInput = andClauses.length > 0 ? { AND: andClauses } : {};

    return prisma.entry.findMany({
      where,
      include: {
        category: true,
        tags: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  async findById(id: string) {
    const entry = await prisma.entry.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
      },
    });

    if (!entry) {
      throw new Error(`Entry with ID "${id}" not found`);
    }

    return entry;
  }

  async create(data: CreateEntryInput) {
    // Format tag connectOrCreate array
    const tagConnectOrCreate = (data.tags || []).map((tagName) => {
      const cleanName = tagName.trim().toLowerCase();
      return {
        where: { name: cleanName },
        create: { name: cleanName },
      };
    });

    return prisma.entry.create({
      data: {
        title: data.title,
        type: data.type,
        content: data.content,
        description: data.description || null,
        example: data.example || null,
        categoryId: data.categoryId,
        tags: {
          connectOrCreate: tagConnectOrCreate,
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });
  }

  async update(id: string, data: UpdateEntryInput) {
    // If tags are provided, update them
    let tagsUpdate: Prisma.TagUpdateManyWithoutEntriesNestedInput | undefined;

    if (data.tags !== undefined) {
      tagsUpdate = {
        set: [], // Disconnect old tags
        connectOrCreate: data.tags.map((tagName) => {
          const cleanName = tagName.trim().toLowerCase();
          return {
            where: { name: cleanName },
            create: { name: cleanName },
          };
        }),
      };
    }

    return prisma.entry.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.type ? { type: data.type } : {}),
        ...(data.content ? { content: data.content } : {}),
        ...(data.description !== undefined ? { description: data.description || null } : {}),
        ...(data.example !== undefined ? { example: data.example || null } : {}),
        ...(data.categoryId ? { categoryId: data.categoryId } : {}),
        ...(tagsUpdate ? { tags: tagsUpdate } : {}),
      },
      include: {
        category: true,
        tags: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.entry.delete({
      where: { id },
    });
  }
}

export const entriesService = new EntriesService();
