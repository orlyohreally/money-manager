import { ObjectId } from "bson";
import { DocumentToObjectOptions } from "mongoose";

export const modelTransformer: DocumentToObjectOptions = {
  versionKey: false,
  transform: (doc, ret: { _id: ObjectId }) => ({
    ...ret,
    _id: ret._id.toString(),
  }),
};
