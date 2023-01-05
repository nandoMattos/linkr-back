import hashtagsRepository from "../repositories/hashtagsRepository.js";
import postsRepository from "../repositories/postsRepository.js";

export async function getTrendings(req, res) {
  try {
    const tags = await hashtagsRepository.getTrendings();

    res.send(
      tags.rows.map((t) => {
        return { id: t.id, name: t.name };
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getPostsWithTag(req, res) {
  try {
    const postsWithTag = await postsRepository.getPostsWithTag(
      res.locals.tagId
    );

    res.send(postsWithTag.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
