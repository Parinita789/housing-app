import Joi from 'joi';
import { USER_TYPE } from '../constants/userType';

export const userSchema = Joi.object({
  first_name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  last_name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),    
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
  phone_number: Joi.string(),
  user_type: Joi.string()
    .valid(...Object.values(USER_TYPE))
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
})
