import type { Request, Response, NextFunction } from "express";
import { categoriesService } from "./categories.service.js";
import { CreateCategoryDto, UpdateCategoryDto } from "./categories.dto.js";

export class CategoriesController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoriesService.findAll();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoriesService.findById(req.params.id as string);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = CreateCategoryDto.parse(req.body);
      const newCategory = await categoriesService.create(validated);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = UpdateCategoryDto.parse(req.body);
      const updated = await categoriesService.update(req.params.id as string, validated);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoriesService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const categoriesController = new CategoriesController();
