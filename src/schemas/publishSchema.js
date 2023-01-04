import joi from "joi";

const publishSchema = joi.object({
    url: joi.uri().required(),
    description: joi.string().max(400)
})

export default publishSchema;