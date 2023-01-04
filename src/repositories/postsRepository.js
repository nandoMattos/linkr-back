import connection from "../database/db.js";

function getPostsWithTag(tagId) {
  return connection.query(
    `
    SELECT u.name, u.picture_url, p.url, p.description, h.name
    FROM users u
    JOIN posts p ON u.id = p.id_user
    JOIN post_hashtag ph ON p.id = ph.id_post
    JOIN hashtags h ON h.id = ph.id_hashtag
    WHERE h.id = $1;
  `,
    [tagId]
  );
}

function getPostById(postId) {
  return connection.query(
    `
    SELECT *
    FROM posts 
    WHERE id = $1;
  `,
    [postId]
  );
}

function doesUserLikedPost(userId, postId) {
  return connection.query(
    `
    SELECT *
    FROM likes
    WHERE id_user = $1
      AND id_post = $2;
  `,
    [userId, postId]
  );
}

function likePost(userId, postId) {
  return connection.query(
    `
    INSERT INTO likes
    (id_user, id_post)
    VALUES
    ($1, $2);
  `,
    [userId, postId]
  );
}

function deleteLike(userId, postId) {
  return connection.query(
    `
    DELETE FROM likes
    WHERE id_user = $1
      AND id_post = $2;
  `,
    [userId, postId]
  );
}

const postsRepository = {
  getPostsWithTag,
  getPostById,
  doesUserLikedPost,
  likePost,
  deleteLike,
};

export default postsRepository;
