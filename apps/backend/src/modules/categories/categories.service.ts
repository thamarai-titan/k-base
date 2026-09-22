import { prisma } from "@repo/database";
import type { CreateCategoryInput, UpdateCategoryInput } from "./categories.dto.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export class CategoriesService {
  async findAll() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { entries: true },
        },
      },
    });
  }

  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        entries: {
          include: { tags: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!category) {
      throw new Error(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async create(data: CreateCategoryInput) {
    const slug = data.slug || slugify(data.name);

    return prisma.category.create({
      data: {
        name: data.name,
        slug,
      },
    });
  }

  async update(id: string, data: UpdateCategoryInput) {
    const slug = data.slug || (data.name ? slugify(data.name) : undefined);

    return prisma.category.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(slug ? { slug } : {}),
      },
    });
  }

  async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}

export const categoriesService = new CategoriesService();
