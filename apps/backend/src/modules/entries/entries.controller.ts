import type { Request, Response, NextFunction } from "express";
import { entriesService } from "./entries.service.js";
import { CreateEntryDto, UpdateEntryDto, EntryQueryDto } from "./entries.dto.js";

export class EntriesController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = EntryQueryDto.parse(req.query);
      const entries = await entriesService.findAll(query);
      res.json(entries);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await entriesService.findById(req.params.id as string);
      res.json(entry);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = CreateEntryDto.parse(req.body);
      const newEntry = await entriesService.create(validated);
      res.status(201).json(newEntry);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = UpdateEntryDto.parse(req.body);
      const updated = await entriesService.update(req.params.id as string, validated);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await entriesService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const entriesController = new EntriesController();
