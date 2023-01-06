import { Router } from "express";
import {
  getPostsWithTag,
  getTrendings,
} from "../controllers/hashtagsController.js";
import { tagExistsValidationMiddleware } from "../middlewares/hashtagsMiddleware.js";
import { validateUserToken } from "../middlewares/userTokenMiddleware.js";

const router = Router();

router.get("/hashtags/trendings", validateUserToken, getTrendings);
router.get(
  "/hashtags/:tagname",
  validateUserToken,
  tagExistsValidationMiddleware,
  getPostsWithTag
);

export default router;
