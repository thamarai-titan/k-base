import { prisma, type Prisma } from "@repo/database";
import type { CreateEntryInput, UpdateEntryInput, EntryQueryInput } from "./entries.dto.js";

export class EntriesService {
  async findAll(query: EntryQueryInput) {
    const where: Prisma.EntryWhereInput = {};

    // Filter by type
    if (query.type) {
      where.type = query.type;
    }

    // Filter by Category (by ID or Slug)
    if (query.category) {
      where.OR = [
        { categoryId: query.category },
        { category: { slug: query.category } },
        { category: { name: { equals: query.category, mode: "insensitive" } } },
      ];
    }

    // Filter by Tag
    if (query.tag) {
      where.tags = {
        some: {
          name: { equals: query.tag, mode: "insensitive" },
        },
      };
    }

    // Search query across title, content, description
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchConditions: Prisma.EntryWhereInput[] = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { content: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];

      if (where.OR) {
        where.AND = [{ OR: searchConditions }];
      } else {
        where.OR = searchConditions;
      }
    }

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
