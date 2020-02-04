import { Document, model, Schema } from "mongoose";

import { Family } from "@shared/types";

type FamilyDocument = Family & Document;

const FamilySchema = new Schema<Family>(
  {
    name: { type: String, required: true },
    icon: String,
    currency: String,
    equalPayments: Boolean,
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false }
);
FamilySchema.pre<FamilyDocument>("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});
FamilySchema.pre<FamilyDocument>("updateOne", function() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

export const FamilyModel = model<FamilyDocument>("FamilyModel", FamilySchema);
