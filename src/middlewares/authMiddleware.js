import joi from "joi";

const signUpSchema = joi.object({
  username: joi.string().min(2).max(20).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(100).required(),
  picture_url: joi.string().required()
});

export async function validateSignUp(req, res, next) {
  const { username, email, password, picture_url} = req.body;

  const validation = signUpSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const error = validation.error.details.map(value => value.message);

    return res.status(422).send(error);
  }

  res.locals.user = { username, email, password, picture_url };
  next();
}