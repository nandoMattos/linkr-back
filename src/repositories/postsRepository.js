import connection from "../database/db.js";

function getAllPosts({ offset, noLimit }) {
  return connection.query(`
  SELECT u.id, p.id as "postId", u.username, u.picture_url as profilePicture, p.url, p.description,
      json_agg(
        DISTINCT like_user.username
      ) as "likedBy",
      json_agg( DISTINCT
        jsonb_build_object(
            'id', c.id,
            'comment', c.comment,
            'profile_picture', comment_user.picture_url,
            'username', comment_user.username
         )
      ) as "comments"
    FROM posts p
      JOIN users u ON p.id_user = u.id
      LEFT JOIN post_hashtag ph ON p.id = ph.id_post 
      LEFT JOIN hashtags h ON h.id = ph.id_hashtag
      LEFT JOIN likes l ON l.id_post = p.id
      LEFT JOIN users like_user ON like_user.id = l.id_user
      LEFT JOIN comments c ON c.id_post = p.id
      LEFT JOIN users comment_user ON comment_user.id = c.id_user
    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC
    ${noLimit ? "" : "LIMIT 10"}
    OFFSET $1;
  `, [offset]);
}

function getAllPostsByUserId(id) {
  return connection.query(
    `
    SELECT u.id, p.id as "postId", u.username, u.picture_url as profilePicture, p.url, p.description,
      json_agg(
        DISTINCT like_user.username
      ) as "likedBy",
      json_agg( DISTINCT
        jsonb_build_object(
          'id', c.id,
          'comment', c.comment,
          'profile_picture', comment_user.picture_url,
          'username', comment_user.username
        )
      ) as "comments", 
      COUNT (DISTINCT rp.id) as "repost_count"
    FROM posts p
      JOIN users u ON p.id_user = u.id
      LEFT JOIN post_hashtag ph ON p.id = ph.id_post 
      LEFT JOIN hashtags h ON h.id = ph.id_hashtag
      LEFT JOIN likes l ON l.id_post = p.id
      LEFT JOIN users like_user ON like_user.id = l.id_user
      LEFT JOIN comments c ON c.id_post = p.id
      LEFT JOIN users comment_user ON comment_user.id = c.id_user
      LEFT JOIN reposts rp ON rp.id_post = p.id
      WHERE u.id = $1
    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC
    LIMIT 10;
  `,
    [id]
  );
}

function getReposts() {
  return connection.query(
    `
    SELECT  p.id_user as "id", p.id as "postId", user_post.username, u.picture_url as profilePicture, p.url, p.description,
      json_agg(
        DISTINCT like_user.username
      ) as "likedBy",
      json_agg( DISTINCT
        jsonb_build_object(
          'id', c.id,
          'userId', comment_user.id,
          'comment', c.comment,
          'profile_picture', comment_user.picture_url,
          'username', comment_user.username
        )
      ) as "comments", 
      json_agg( DISTINCT
        jsonb_build_object(
          'id', u.id,
          'username', u.username
        )
      ) as "user"
    FROM reposts rp
      LEFT JOIN users u ON rp.id_user = u.id
      LEFT JOIN posts p ON p.id = rp.id_post
      LEFT JOIN users user_post ON user_post.id = p.id_user 
      LEFT JOIN post_hashtag ph ON p.id = ph.id_post 
      LEFT JOIN hashtags h ON h.id = ph.id_hashtag
      LEFT JOIN likes l ON l.id_post = p.id
      LEFT JOIN users like_user ON like_user.id = l.id_user
      LEFT JOIN comments c ON c.id_post = p.id
      LEFT JOIN users comment_user ON comment_user.id = c.id_user
    GROUP BY p.id, u.id, rp.id, user_post.username
    ORDER BY p.created_at DESC
  LIMIT 10;
  `);
}

function getPostsWithTag(tagId) {
  return connection.query(
    `
    SELECT u.id, p.id as "postId", u.username, u.picture_url as profilePicture, p.url, p.description,
      json_agg(
        DISTINCT like_user.username
      ) as "likedBy",
      json_agg( DISTINCT
        jsonb_build_object(
          'id', c.id,
          'comment', c.comment,
          'profile_picture', comment_user.picture_url,
          'username', comment_user.username
        )
      ) as "comments"
    FROM posts p
      JOIN users u ON p.id_user = u.id
      LEFT JOIN post_hashtag ph ON p.id = ph.id_post 
      LEFT JOIN hashtags h ON h.id = ph.id_hashtag
      LEFT JOIN likes l ON l.id_post = p.id
      LEFT JOIN users like_user ON like_user.id = l.id_user
      LEFT JOIN comments c ON c.id_post = p.id
      LEFT JOIN users comment_user ON comment_user.id = c.id_user
      WHERE h.id = $1
    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC
    LIMIT 10;
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

function insertLike(userId, postId) {
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

function searchHashtag(hashtag) {
  return connection.query(
    `
    SELECT name FROM hashtags
    WHERE name = $1
  `,
    [hashtag]
  );
}

function addNewHashtag(hashtag) {
  return connection.query(
    `
    INSERT INTO hashtags (name) VALUES ($1)
    RETURNING id
    `,
    [hashtag]
  );
}

function getTagId(hashtag) {
  return connection.query(
    `
    SELECT id
    FROM hashtags
    WHERE name = $1;
    `,
    [hashtag]
  );
}

function addNewPost(userId, url, description) {
  return connection.query(
    `
    INSERT INTO posts (id_user, url, description)
    VALUES ($1, $2, $3)
    RETURNING id
    `,
    [userId, url, description]
  );
}

function postXHash(idHashtag, idPost) {
  return connection.query(
    `
    INSERT INTO post_hashtag (id_post, id_hashtag)
    VALUES ($1, $2)
    `,
    [idPost, idHashtag]
  );
}

function postXUser(userId, postId) {
  return connection.query(
    `
    SELECT description FROM posts
    WHERE id = $1 AND id_user = $2
    `,
    [postId, userId]
  );
}

export function removepostXHash(hashtag, postId) {
  return connection.query(
    `
    DELETE FROM post_hashtag 
    WHERE id_hashtag = $1 AND id_post = $2
    `,
    [hashtag, postId]
  );
}

export function removePost(postId) {
  return connection.query(
    `
    DELETE FROM posts 
    WHERE  id = $1
    `,
    [postId]
  );
}

export function removeLikes(postId) {
  return connection.query(
    `
    DELETE FROM likes 
    WHERE  id_post = $1
    `,
    [postId]
  );
}

export function newDescriptionPost(newDescription, postId) {
  return connection.query(
    `
    UPDATE posts SET description = $1
    WHERE id = $2
    `,
    [newDescription, postId]
  );
}

export function insertComment(userId, postId, comment) {
  return connection.query(
    `
    INSERT INTO comments
    (id_user, id_post, comment) 
    VALUES
    ($1, $2, $3);
  `,
    [userId, postId, comment]
  );
}

export function respostBy(userId, postId) {
  return connection.query(
    `
    INSERT INTO reposts (id_user, id_post)
    VALUES
    ($1, $2)
  `,
    [userId, postId]
  );
}

const postsRepository = {
  getPostsWithTag,
  getPostById,
  getAllPostsByUserId,
  doesUserLikedPost,
  insertLike,
  deleteLike,
  getAllPosts,
  searchHashtag,
  addNewHashtag,
  getTagId,
  addNewPost,
  postXHash,
  postXUser,
  removepostXHash,
  removePost,
  removeLikes,
  newDescriptionPost,
  insertComment,
  respostBy,
  getReposts
};

export default postsRepository;
