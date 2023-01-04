import { Router } from "express";
import hashtagsRouter from "./hashtagsRouter.js";
import likesRouter from "./likesRouter.js";

const router = Router();
router.use(hashtagsRouter);
router.use(likesRouter);

export default router;
