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

const postsRepository = {
  getPostsWithTag,
};

export default postsRepository;
