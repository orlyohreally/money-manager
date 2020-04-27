import * as cloudinary from "cloudinary";
import * as dotenv from "dotenv";

import { IImageLoaderDao } from "./ImageManagerService";

export class ImageManagerDao implements IImageLoaderDao {
  constructor() {
    this.configCloudinary();
  }

  public async loadImage(image: string, path: string): Promise<string> {
    return cloudinary.v2.uploader
      .upload(image, { public_id: path, overwrite: true })
      .then(result => {
        return result.secure_url || result.url;
      })
      .catch(e => {
        console.log("error", e);
        return "";
      });
  }

  public deleteImage(imageURL: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.destroy(imageURL, (error: Error, result: void) => {
        if (error) {
          reject(error);
        }
        resolve(undefined);
      });
    });
  }

  private configCloudinary() {
    dotenv.config();
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    });
  }
}
