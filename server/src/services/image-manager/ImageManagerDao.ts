import * as cloudinary from "cloudinary";
import * as dotenv from "dotenv";
import { IImageLoaderDao } from "./ImageManagerService";

export class ImageManagerDao implements IImageLoaderDao {
  constructor() {
    this.configCloudinary();
  }

  public loadImage(image: string, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        image,
        { public_id: path, overwrite: true },
        (error: Error, result: { secure_url: string; url: string }) => {
          if (error) {
            reject(error);
          }
          if (!result) {
            reject("Something went wrong");
          }
          resolve(result.secure_url || result.url);
        }
      );
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
