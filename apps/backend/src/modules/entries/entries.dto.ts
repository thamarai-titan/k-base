import { z } from "zod";

export const EntryTypeEnum = z.enum(["COMMAND", "NOTE", "SNIPPET"]);

export const CreateEntryDto = z.object({
  title: z.string().min(1, "Title is required").trim(),
  type: EntryTypeEnum.default("NOTE"),
  content: z.string().min(1, "Content is required"),
  description: z.string().trim().optional().nullable(),
  example: z.string().trim().optional().nullable(),
  categoryId: z.string().min(1, "Category ID is required"),
  tags: z.array(z.string().trim().min(1)).optional().default([]),
});

export const UpdateEntryDto = z.object({
  title: z.string().min(1, "Title cannot be empty").trim().optional(),
  type: EntryTypeEnum.optional(),
  content: z.string().min(1, "Content cannot be empty").optional(),
  description: z.string().trim().optional().nullable(),
  example: z.string().trim().optional().nullable(),
  categoryId: z.string().min(1, "Category ID cannot be empty").optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});

export const EntryQueryDto = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  type: EntryTypeEnum.optional(),
});

export type CreateEntryInput = z.infer<typeof CreateEntryDto>;
export type UpdateEntryInput = z.infer<typeof UpdateEntryDto>;
export type EntryQueryInput = z.infer<typeof EntryQueryDto>;
