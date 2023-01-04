import { Router } from "express";
import { createPost, deslikePost, getAllPosts, likePost } from "../controllers/postsController.js";

import {
  postExistsValidationMiddleware,
  postValidateSchema,
  userAlreadyLikedPostMiddleware,
} from "../middlewares/postsMiddleware.js";

const router = Router();

router.get("/posts", getAllPosts);

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

router.post("/posts", postValidateSchema, createPost);


export default router;
