import connection from "../database/db.js";

function getAllPosts() {
  return connection.query(`
    SELECT u.id, u.username, u.picture_url as profilePicture, p.url, p.description,
      json_agg(
        DISTINCT h.name
      ) as "hashtags",
      json_agg(
        DISTINCT like_user.username
      ) as "likedBy"
    FROM posts p
      JOIN users u ON p.id_user = u.id
      LEFT JOIN post_hashtag ph ON p.id = ph.id_post 
      LEFT JOIN hashtags h ON h.id = ph.id_hashtag
      LEFT JOIN likes l ON l.id_post = p.id
      LEFT JOIN users like_user ON like_user.id = l.id_user
    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC
    LIMIT 20;
  `);
}

function getAllPostsByUserId(id) {
  return connection.query(`
    SELECT u.id, u.username, u.picture_url as profilePicture, p.url, p.description,
      json_agg(
        DISTINCT h.name
      ) as "hashtags",
      json_agg(
        DISTINCT like_user.username
      ) as "likedBy"
    FROM posts p
      JOIN users u ON p.id_user = u.id
      LEFT JOIN post_hashtag ph ON p.id = ph.id_post 
      LEFT JOIN hashtags h ON h.id = ph.id_hashtag
      LEFT JOIN likes l ON l.id_post = p.id
      LEFT JOIN users like_user ON like_user.id = l.id_user
    WHERE u.id = $1
    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC
    LIMIT 20;
  `, [id]);
}

function getPostsWithTag(tagId) {
  return connection.query(
    `
    SELECT u.username, u.picture_url as profilePicture, p.url, p.description,
    json_agg(
      DISTINCT h.name
    ) as "hashtags",
    json_agg(
      DISTINCT like_user.username
    ) as "likedBy"
    FROM posts p
      JOIN users u ON p.id_user = u.id
      LEFT JOIN post_hashtag ph ON p.id = ph.id_post 
      LEFT JOIN hashtags h ON h.id = ph.id_hashtag
      LEFT JOIN likes l ON l.id_post = p.id
      LEFT JOIN users like_user ON like_user.id = l.id_user
    WHERE h.id = $1
    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC
    LIMIT 20;
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

function addNewHashtag (hashtag) {
  return connection.query(
    `
    INSERT INTO hashtags (name) VALUES ($1)
    `,
    [hashtag]
  );
}

function sumTag (hashtag) {
  return connection.query(
    `
    UPDATE hashtags SET posts_amount = posts_amount + 1
    WHERE name = $1
    `,
    [hashtag]
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
  sumTag
};

export default postsRepository;
