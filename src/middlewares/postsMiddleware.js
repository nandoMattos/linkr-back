import postsRepository from "../repositories/postsRepository.js";

export async function postExistsValidationMiddleware(req, res, next) {
  try {
    const postsExists = await postsRepository.getPostById(req.params.id);

    if (!postsExists.rows[0]) {
      res.status(404).send("Post não encontrado.");
      return;
    }

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function userAlreadyLikedPostMiddleware(req, res, next) {
  res.locals.userId = 3;
  try {
    const isPostLiked = await postsRepository.doesUserLikedPost(
      res.locals.userId,
      req.params.id
    );
    console.log(isPostLiked.rows);

    if (isPostLiked.rows[0]) {
      res.status(400).send("O usuário já curtiu esse post");
      return;
    }

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
