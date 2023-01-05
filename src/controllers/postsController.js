import postsRepository from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";

export async function likePost(req, res) {
  try {
    await postsRepository.insertLike(res.locals.userId, req.params.id);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function deslikePost(req, res) {
  try {
    await postsRepository.deleteLike(res.locals.userId, req.params.id);

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getAllPosts(req, res) {
  try {
    const { rows } = await postsRepository.getAllPosts();

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
