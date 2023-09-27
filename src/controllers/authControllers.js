import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { listUser, saveUser, insertSession, 
  deleteSession, findUsersByName, listUserName, 
  insertFollow, deleteFollow, verifyFollowUser, getAllFollowing } from "../repositories/authRepository.js";
import dotenv from "dotenv";
dotenv.config();

export async function signUp(req, res) {
  const { username, email, password, picture_url } = res.locals.user;

  try {
    new URL(picture_url);

    const user = await listUser(email);
    const userName = await listUserName(username);

    if (user.rowCount > 0 || userName.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await saveUser(username, email, passwordHash, picture_url);

    res.sendStatus(201);

  } catch (error) {
    console.log(error)
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

export async function findUsersLikeName(req, res) {
  const name = req.query.name;
  const idUser = res.locals.id_user;
  
  try {
    const follows = await getAllFollowing(idUser);

    const listFollowig = [];
    for(const f of follows.rows) {
      listFollowig.push(f.id_user_followed)
    }

    const { rows } = await findUsersByName(name);
    const usersFollowing = [];
    const notFollowingUsers = [];

    for (let user of rows) {
      if(listFollowig.includes(user.id)) {
        user.follows = true;
        usersFollowing.push(user);
      } else {
        notFollowingUsers.push(user);
      }
    }
    
    res.send([...usersFollowing, ...notFollowingUsers]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function verifyUserFollows(req, res) {
  const { id_user_follower, id_user_followed } = req.body;

  try {
    const follow = await verifyFollowUser(id_user_follower, id_user_followed);

    if(follow.rowCount === 0) {
      return res.status(200).send({"follow": false});
    }
    
    return res.status(200).send({"follow": true});

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  } 
}

export async function followUser(req, res) {
  const { id_user_follower, id_user_followed } = req.body;

  if(id_user_follower === id_user_followed) return res.sendStatus(400);

  try {
    const follow = await verifyFollowUser(id_user_follower, id_user_followed);

    if(follow.rowCount === 0) {
      await insertFollow(id_user_follower, id_user_followed);
      return res.status(200).send({"follow": true});
    }
    
    await deleteFollow(id_user_follower, id_user_followed);
    return res.status(200).send({"follow": false});

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  } 
}

export async function findAllFollowing(req, res) {
  const idUser = res.locals.id_user;

  try {
    const { rows } = await getAllFollowing(idUser);

    return res.send(rows).status(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}