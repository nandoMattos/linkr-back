import { Router } from "express";
import { validateSignUp } from "../middlewares/authMiddleware.js";
import { signUp } from "../controllers/authControllers.js";

const router = Router();

router
  .post("/signup", validateSignUp, signUp);

export default router;