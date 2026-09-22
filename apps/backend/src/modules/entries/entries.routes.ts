import { Router } from "express";
import { entriesController } from "./entries.controller.js";

const router: Router = Router();

router.get("/", (req, res, next) => entriesController.getAll(req, res, next));
router.post("/", (req, res, next) => entriesController.create(req, res, next));
router.get("/:id", (req, res, next) => entriesController.getOne(req, res, next));
router.put("/:id", (req, res, next) => entriesController.update(req, res, next));
router.delete("/:id", (req, res, next) => entriesController.delete(req, res, next));

export const entriesRouter: Router = router;
