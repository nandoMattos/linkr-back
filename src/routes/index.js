import { Router } from "express";
import hashtagsRouter from "./hashtagsRouter.js";

const router = Router();
router.use(hashtagsRouter);

export default router;
