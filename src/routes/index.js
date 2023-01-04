import { Router } from "express";
import hashtagsRouter from "./hashtagsRouter.js";
import postsRouter from "./postsRouter.js";

const router = Router();
router.use(hashtagsRouter);
router.use(postsRouter);

export default router;
