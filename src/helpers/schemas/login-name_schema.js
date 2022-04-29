import Joi from 'joi';

const authSchema = Joi.object({
    name: Joi.string().required(),
});

export { authSchema };
