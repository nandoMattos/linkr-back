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
  res.locals.userId = 1;
  try {
    const isPostLiked = await postsRepository.doesUserLikedPost(
      res.locals.userId,
      req.params.id
    );

    let verification;

    req.method === "POST"
      ? (verification = isPostLiked.rows[0] != undefined)
      : (verification = isPostLiked.rows[0] === undefined);

    if (verification) {
      res.sendStatus(400);
      return;
    }

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
