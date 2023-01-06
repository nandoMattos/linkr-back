import { Router } from "express";
import { createPost, deletePost, deslikePost, getAllPosts, getAllPostsByUserId, likePost } from "../controllers/postsController.js";
import {validateUserToken} from "../middlewares/userTokenMiddleware.js"

import {
  postBelongsUser,
  postExistsValidationMiddleware,
  postValidateSchema,
  userAlreadyLikedPostMiddleware,
} from "../middlewares/postsMiddleware.js";

const router = Router();

router.get("/posts", getAllPosts);

router.get("/posts/user/:id", getAllPostsByUserId);

router.post(
  "/posts/:id/like",
  validateUserToken,
  postExistsValidationMiddleware,
  userAlreadyLikedPostMiddleware,
  likePost
);

router.delete(
  "/posts/:id/deslike",
  validateUserToken,
  postExistsValidationMiddleware,
  userAlreadyLikedPostMiddleware,
  deslikePost
);

router.post ("/posts", postValidateSchema, createPost);

router.delete("/posts", 
validateUserToken,
postBelongsUser,
deletePost
);

export default router;
