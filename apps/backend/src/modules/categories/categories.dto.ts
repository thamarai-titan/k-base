import { z } from "zod";

export const CreateCategoryDto = z.object({
  name: z.string().min(1, "Name is required").trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase alphanumeric characters and hyphens")
    .optional(),
});

export const UpdateCategoryDto = z.object({
  name: z.string().min(1, "Name cannot be empty").trim().optional(),
  slug: z
    .string()
    .min(1, "Slug cannot be empty")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase alphanumeric characters and hyphens")
    .optional(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategoryDto>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategoryDto>;
