declare module "cloudinary" {
  interface v2API {
    config(configs: {}): void;
    uploader: IUploader;
  }

  interface IUploader {
    upload(
      image: string,
      params: {},
      callback: (
        error: Error,
        result: { secure_url: string; url: string }
      ) => void
    ): string;
    destroy(
      imageUrl: string,
      callback: (error: Error, result: void) => void
    ): void;
  }
  export const v2: v2API;
}
