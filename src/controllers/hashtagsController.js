import hashtagsRepository from "../repositories/hashtagsRepository.js";
import postsRepository from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata"

export async function getTrendings(req, res) {
  try {
    const tags = await hashtagsRepository.getTrendings();

    res.send(
      tags.rows.map((t) => {
        return { id: t.hashtagId, name: t.hashtagName };
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getPostsWithTag(req, res) {
  try {
    const {rows} = await postsRepository.getPostsWithTag(
      res.locals.tagId
    );

    for (const post of rows) {
      const metadata = await urlMetadata(post.url);
      post.title = metadata.title;
      post.image = metadata.image;
      post.linkDescription = metadata.description;
    }

    res.send(rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
