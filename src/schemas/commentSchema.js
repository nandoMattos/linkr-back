import joi from "joi"

const commentSchema = joi.object({
  comment: joi.string().max(200).required()
})

export default commentSchema;