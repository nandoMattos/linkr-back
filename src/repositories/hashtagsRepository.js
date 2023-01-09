import connection from "../database/db.js";

function getTrendings() {
  return connection.query(
    `
    SELECT h.id as "hashtagId", h.name as "hashtagName", COUNT(h.id) as "postAmount"
    FROM posts p
      JOIN post_hashtag ph ON p.id = ph.id_post
      JOIN hashtags h ON h.id = ph.id_hashtag
    GROUP BY h.name, h.id
    ORDER BY "postAmount" DESC, "hashtagName"
    LIMIT 10;
  `
  );
}

function getHashtagByName(tagName) {
  return connection.query(
    `
    SELECT *
    FROM hashtags
    WHERE name = $1;
  `,
    [tagName]
  );
}

const hashtagsRepository = {
  getTrendings,
  getHashtagByName,
};

export default hashtagsRepository;
