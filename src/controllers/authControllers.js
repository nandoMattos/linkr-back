import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { listUser, saveUser, insertSession, deleteSession } from "../repositories/authRepository.js";
import dotenv from "dotenv";
dotenv.config();

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

export async function signIn(req, res) {
  const { email, password } = res.locals.user;

  try {
    const user = await listUser(email);

    if (user.rowCount === 0 || !bcrypt.compareSync(password, user.rows[0].password)) {
      return res.sendStatus(401);
    }

    const token = jwt.sign({ user: user.rows[0].id }, process.env.TOKEN_SECRET);

    await deleteSession(user.rows[0]);
    await insertSession(user.rows[0], token);

    delete user.rows[0].password;
    delete user.rows[0].created_at;

    res.status(200).send({
      ...user.rows[0],
      token
    });

  } catch (error) {
    res.status(500).send(error.message);
  }
}