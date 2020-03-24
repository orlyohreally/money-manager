import { Document, model, Schema } from "mongoose";

import { User } from "@shared/types";

type UserDocument = User & Document;

const UserSchema = new Schema<User>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255
    },
    colorScheme: { type: String, required: true, default: "primary" },
    icon: String,
    isVerified: { type: Boolean, default: false },
    currency: { type: String, default: "USD" },
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false, autoIndex: true }
);

UserSchema.pre<UserDocument>("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});
UserSchema.pre<UserDocument>("updateOne", function() {
  this.update({}, { $set: { updatedAt: new Date() } });
});
export const UserModel = model<UserDocument>("UserModel", UserSchema);
