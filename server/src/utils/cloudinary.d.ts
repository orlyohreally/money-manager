declare module "cloudinary" {
  interface v2API {
    config(configs: {}): void;
    uploader: IUploader;
  }

  export interface UploadApiResponse {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: Array<string>;
    pages: number;
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    access_mode: string;
    original_filename: string;
    moderation: Array<string>;
    access_control: Array<string>;
    context: object;
    metadata: object;

    [futureKey: string]: any;
  }

  interface IUploader {
    upload(
      image: string,
      params: {},
      callback: (error: Error, result: UploadApiResponse) => void
    ): string;
    upload(image: string, params: {}): Promise<UploadApiResponse>;

    destroy(
      imageUrl: string,
      callback: (error: Error, result: void) => void
    ): void;
  }
  export const v2: v2API;
}
