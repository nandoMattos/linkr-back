import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { listUser, saveUser, insertSession, deleteSession } from "../repositories/authRepository.js";

export async function signUp(req, res) {
  const { username, email, password, picture_url } = res.locals.user;


  try {
    new URL(picture_url);

    const user = await listUser(email);

    if (user.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await saveUser(username, email, passwordHash, picture_url);

    res.sendStatus(201);

  } catch (error) {
    res.status(500).send(error.message);
  }
}