import { Document, model, Schema } from "mongoose";

import { Family } from "@shared/types";

type FamilyDocument = Family & Document;

const FamilySchema = new Schema<Family>({
  name: { type: String, required: true },
});
export const FamilyModel = model<FamilyDocument>("FamilyModel", FamilySchema);
