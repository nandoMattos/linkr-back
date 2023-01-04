import postsRepository from "../repositories/postsRepository.js";

export async function likePost(req, res) {
  try {
    await postsRepository.likePost(res.locals.userId, req.params.id);

    res.send(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
