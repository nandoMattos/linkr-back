import { Router } from "express";
import { validateSignIn, validateSignUp } from "../middlewares/authMiddleware.js";
import { findUsersLikeName, signIn, signUp } from "../controllers/authControllers.js";

const router = Router();

router
  .post("/signup", validateSignUp, signUp)
  .post("/signin", validateSignIn, signIn)
  .get("/users", findUsersLikeName);

export default router;