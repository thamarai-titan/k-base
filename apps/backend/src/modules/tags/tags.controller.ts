import type { Request, Response, NextFunction } from "express";
import { tagsService } from "./tags.service.js";

export class TagsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await tagsService.findAll();
      res.json(tags);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await tagsService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const tagsController = new TagsController();
