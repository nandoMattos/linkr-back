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