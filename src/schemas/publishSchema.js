import joi from "joi";

const publishSchema = joi.object({
    url: joi.string().uri().required(),
    description: joi.string().empty("")
})

export default publishSchema;