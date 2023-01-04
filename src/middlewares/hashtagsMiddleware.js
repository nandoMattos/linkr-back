import hashtagsRepository from "../repositories/hashtagsRepository.js";

export async function tagExistsValidationMiddleware(req, res, next) {
  try {
    const tagExists = await hashtagsRepository.getHashtagByName(
      req.params.tagname
    );

    // dont know if its better to return an empty array or throw an error
    if (!tagExists.rows[0]) {
      res.status(404).send("Hashtag não encontrada");
      return;
    }

    hashtagsRepository.incrementView(tagExists.rows[0].id);
    res.locals.tagId = tagExists.rows[0].id;
    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
