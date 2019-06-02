import { Document, model, Schema } from "mongoose";

import { User } from "@shared/types";

type UserDocument = User & Document;

const UserSchema = new Schema<User>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    colorScheme: { type: String, required: true, default: "primary" },
    icon: String,
    createdAt: Date,
    updatedAt: Date,
  },
  { versionKey: false },
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
