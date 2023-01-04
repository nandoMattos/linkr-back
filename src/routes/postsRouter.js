import { Router } from "express";
import { deslikePost, getAllPosts, getAllPostsByUserId, likePost } from "../controllers/postsController.js";

import {
  postExistsValidationMiddleware,
  userAlreadyLikedPostMiddleware,
} from "../middlewares/postsMiddleware.js";

const router = Router();

router.get("/posts", getAllPosts);

router.get("/posts/user/:id", getAllPostsByUserId);

router.post(
  "/posts/:id/like",
  postExistsValidationMiddleware,
  userAlreadyLikedPostMiddleware,
  likePost
);

router.delete(
  "/posts/:id/deslike",
  postExistsValidationMiddleware,
  userAlreadyLikedPostMiddleware,
  deslikePost
);

export default router;
