import { Router } from "express";
import hashtagsRouter from "./hashtagsRouter.js";
import likesRouter from "./likesRouter.js";
import authRouter from "./authRouter.js";

const router = Router();
router.use(authRouter);
router.use(hashtagsRouter);
router.use(likesRouter);

export default router;
