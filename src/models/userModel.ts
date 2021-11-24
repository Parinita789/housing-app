import { ObjectId } from 'bson';
import { Model, model, Schema } from 'mongoose';
import { USER_TYPE } from '../constants/userType';

export interface IUserDocument extends IUser {
  _id: ObjectId,
  created_at: Date,
  updated_at: Date
}

export interface IUser {
  first_name: string;
  last_name: string;
  email: string,
  password: string,
  phone_number: string,
  user_type: string,
  wishlist: IWishlist[]
}

export interface IWishlist {
  property_id: string;
  thumnail_url: string;
  price: number;
  name: string;
  description: string
}

const wishlistSchema = new Schema({
  property_id: { type: String, required: true },
  thumnail_url: { type: String, required: false },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true }
})

export const userSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
    user_type: { type: String, enum: USER_TYPE, required: true },
    wishlist: [wishlistSchema]
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

userSchema.index({ email: 1 }, { unique: true });
export const userModel: Model<IUserDocument> = model<IUserDocument>('users', userSchema);
