import hashtagsRepository from "../repositories/hashtagsRepository.js";
import postsRepository from "../repositories/postsRepository.js";

export async function getTrendings(req, res) {
  try {
    res.send((await hashtagsRepository.getTrendings()).rows);
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
