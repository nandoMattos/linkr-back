import connection from "../database/db.js";

export async function listUser(email) {
  return await connection.query(`
    SELECT
      *
    FROM
      users
    WHERE
      email = $1;`, [email]);
}

export async function listUserName(username) {
  return await connection.query(`
    SELECT
      *
    FROM
      users
    WHERE
      username = $1;`, [username]);
}

export async function saveUser(username, email, passwordHash, picture_url) {
  return await connection.query(`
  INSERT INTO
    users (username, email, password, picture_url)
  VALUES
    ($1, $2, $3, $4);`, [username, email, passwordHash, picture_url]);
}

export async function insertSession(user, token) {
  return await connection.query(`
    INSERT INTO
      sessions (id_user, token)
    VALUES ($1, $2);`, [user.id, token]);
}

export async function deleteSession(user) {
  return await connection.query(`
    DELETE FROM
      sessions
    WHERE
      id_user = $1;`, [user.id]);
}

export async function findUsersByName(name) {
  return await connection.query(`SELECT id, username, picture_url FROM users WHERE username LIKE $1 LIMIT 3`, [`%${name}%`]);
}

export async function getAllFollowing(id_follower) {
  return await connection.query(`SELECT * FROM follows WHERE id_user_follower = $1`, [id_follower]);
}

export async function verifyFollowUser(id_follower, id_followed) {
  return await connection.query(`SELECT * FROM follows WHERE id_user_follower = $1 AND id_user_followed = $2`, [id_follower, id_followed])
}

export async function insertFollow(id_follower, id_followed) {
  return await connection.query(`INSERT INTO follows (id_user_follower, id_user_followed) VALUES ($1, $2) `, [id_follower, id_followed])
}

export async function deleteFollow(id_follower, id_followed) {
  return await connection.query(`DELETE FROM follows WHERE id_user_follower = $1 AND id_user_followed = $2`, [id_follower, id_followed])
}

