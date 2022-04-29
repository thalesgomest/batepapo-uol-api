import Joi from 'joi';

const authSchema = Joi.object({
    name: Joi.string().required(),
});

const messageBodySchema = Joi.object({
    to: Joi.string().required(),
    text: Joi.string().required(),
    type: Joi.string().valid('message', 'private_message').required(),
});

export { authSchema, messageBodySchema };
