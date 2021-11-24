import Joi from 'joi';

export const wishlistSchema = Joi.object({
  property_id: Joi.string().required(),
  thumnail_url: Joi.string(),
  price: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string().required()
})