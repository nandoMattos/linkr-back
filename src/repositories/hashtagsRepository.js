import connection from "../database/db.js";

function getTrendings() {
  return connection.query(
    `
    SELECT name 
    FROM hashtags
    ORDER BY views DESC
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

function incrementView(tagId) {
  return connection.query(
    `
    UPDATE hashtags
    SET views = views + 1
    WHERE id = $1;
  `,
    [tagId]
  );
}

const hashtagsRepository = {
  getTrendings,
  getHashtagByName,
  incrementView,
};

export default hashtagsRepository;
