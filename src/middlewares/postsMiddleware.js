import postsRepository from "../repositories/postsRepository.js";
import publishSchema from "../schemas/publishSchema.js";

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
  try {
    const isPostLiked = await postsRepository.doesUserLikedPost(
      res.locals.id_user,
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

export async function postValidateSchema (req, res, next) {
  const post = req.body;

  const { error } = publishSchema.validate(post, {abortEarly: false});

  if (error) {
    const errors = error.details.map( (detail) => detail.message);
    return res.status(400).send( {message: errors});
  }

  next();

}

export async function postBelongsUser(req, res, next) {
  const 
}