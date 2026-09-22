import { Router } from "express";
import { tagsController } from "./tags.controller.js";

const router: Router = Router();

router.get("/", (req, res, next) => tagsController.getAll(req, res, next));
router.delete("/:id", (req, res, next) => tagsController.delete(req, res, next));

export const tagsRouter: Router = router;
