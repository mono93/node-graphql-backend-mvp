import mongoose from 'mongoose';
import { UserAttrs } from '../interface/user.types';
import { auth } from 'express-oauth2-jwt-bearer';

interface UserDocument extends mongoose.Document, UserAttrs {}

/**
 * An interface that describes the properties
 * that a User Model has
 */
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      enum: ['Admin', 'User'],
      required: true,
    },
    auth0Id: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  },
);

/**
 * Virtual populate:
 * One User -> Many Incidents
 * Incident.createdBy -> User._id
 */
userSchema.virtual('incidents', {
  ref: 'Incident',
  localField: '_id',
  foreignField: 'createdBy',
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };
