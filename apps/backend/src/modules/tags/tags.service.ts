import { prisma } from "@repo/database";

export class TagsService {
  async findAll() {
    return prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { entries: true },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.tag.delete({
      where: { id },
    });
  }
}

export const tagsService = new TagsService();
