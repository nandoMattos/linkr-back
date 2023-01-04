import connection from "../database/db.js";

function getTrendings() {
  return connection.query(
    `
    SELECT name 
    FROM hashtags
    ORDER BY posts_amount DESC
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
