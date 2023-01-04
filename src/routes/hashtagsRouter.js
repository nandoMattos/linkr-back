import { Router } from "express";
import {
  getPostsWithTag,
  getTrendings,
} from "../controllers/hashtagsController.js";
import { tagExistsValidationMiddleware } from "../middlewares/hashtagsMiddleware.js";

const router = Router();

router.get("/hashtags/trendings", getTrendings);
router.get(
  "/hashtags/:tagname",
  tagExistsValidationMiddleware,
  getPostsWithTag
);

export default router;
