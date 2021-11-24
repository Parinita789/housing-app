import Joi from 'joi';
import { ROOM_TYPE } from '../constants/roomType';
import { BED_TYPE } from '../constants/bedTypes';
import { SEARCH_TYPE } from '../constants/propertySearchType';

export const propertySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  property_type: Joi.string().required(),
  room_type: Joi.string().valid(...Object.values(ROOM_TYPE)).required(),
  accommodates: Joi.number().required(),
  bedrooms: Joi.number().required(),
  beds: Joi.number().required(),
  bed_type: Joi.string().valid(...Object.values(BED_TYPE)).required(),
  bathrooms: Joi.number().required(),
  price: Joi.number().required(),
  security_deposit: Joi.number().required(),
  amenities: Joi.array().required(),
  images: Joi.array().items(
    Joi.object({
      thumnail_url: Joi.string().allow(''),
      picture_url: Joi.string().allow('')
    })
  ).required(),
  address: Joi.object({
    street: Joi.string().required(),
    government_area: Joi.string().required(),
    market: Joi.string(),
    city: Joi.string().required(),
    pincode: Joi.number().required(),
    country: Joi.string().required(),
    country_code: Joi.string().required(),
    location: Joi.object({
      type: Joi.string().required(),
      lat: Joi.number().required(),
      long: Joi.number().required()
    })
  }),
  age: Joi.string().required(),
  added_by: Joi.string().required(),
  available_from: Joi.date().required(),
})

export const getPropertySchema = Joi.object({
  city: Joi.string().optional(),
  lat: Joi.string(),
  long: Joi.string(),
  radius: Joi.string(),
  country: Joi.string().optional(),
  bedrooms: Joi.string().optional(),
  searchType: Joi.string().valid(...Object.values(SEARCH_TYPE)).required(),
  page: Joi.string(),
  limit: Joi.string()
})
.with('lat', 'long')
.with('radius', 'lat')
.with('radius', 'long')
.with('lat', 'radius')
.with('long', 'radius')