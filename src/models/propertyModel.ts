import { ObjectId } from 'bson';
import { Model, model, Schema } from 'mongoose';
import { IUserDocument } from './userModel';

export interface IPropertyDocument extends IProperty {
  _id: ObjectId,
  created_at: Date,
  updated_at: Date
}

export interface IProperty {
  name: string,
  description: string,
  property_type: string,
  room_type: string,
  bed_type: string,
  accommodates: number,
  bedrooms: number,
  beds: number,
  bathrooms: number,
  price: number,
  security_deposit: number,
  images: IImage,
  address: IAddress,
  added_by: IUserDocument
}

export interface IImage {
  thumnail_url?: string,
  picture_url?: string
}

export interface IAddress {
  street: string,
  government_area: string,
  market?: string,
  city: string,
  country: string,
  country_code: string,
  location: ILocation
}

export interface ILocation {
  type: string,
  lat: number,
  long: number,
}

const image = new Schema({
  thumnail_url: { type: String, required: false },
  picture_url: { type: String, required: false }
},{
  _id: false,
});

const location = new Schema({
  type: { type: String, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true }
},{
  _id: false,
})

const address = new Schema({
  street: { type: String, required: true },
  government_area: { type: String },
  market: { type: String },
  city: { type: String, required: true },
  country: { type: String, required: true },
  country_code: { type: String, required: true },
  location: location
},{
  _id: false,
})

export const propertySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    property_type: { type: String, required: true },
    room_type: { type: String, required: true },
    bed_type: { type: String, required: true },
    accommodates: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    beds: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    price: { type: Number, required: true },
    security_deposit: { type: Number, required: true },
    amenities: { type: Array, required: true },
    images: [image],
    address: address,
    added_by: { type: ObjectId, ref: 'users', required: true },
    available_from: {type: Date, required: true },
    age: { type: String, required: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const propertyModel: Model<IPropertyDocument> = model<IPropertyDocument>('properties', propertySchema);