import { Router } from "express";
import { likePost } from "../controllers/postsController.js";

import {
  postExistsValidationMiddleware,
  userAlreadyLikedPostMiddleware,
} from "../middlewares/postsMiddleware.js";

const router = Router();

router.post(
  "/posts/:id/like",
  postExistsValidationMiddleware,
  userAlreadyLikedPostMiddleware,
  likePost
);

router.delete("/post/:id/deslike");

export default router;
