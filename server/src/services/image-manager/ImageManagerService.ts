export interface IImageLoaderDao {
  loadImage(imageBase64: string, path: string): Promise<string>;
  deleteImage(imageURL: string): Promise<void>;
}

export class ImageManagerService {
  private dao: IImageLoaderDao;

  constructor({ dao }: { dao: IImageLoaderDao }) {
    this.dao = dao;
  }

  public loadImage(imageBase64: string, path: string): Promise<string> {
    const acceptedImageExtensions = ["png", "jpeg", "svg+xml"];
    const imageExtension = imageBase64.substring(
      "data:image/".length,
      imageBase64.indexOf(";base64")
    );
    if (acceptedImageExtensions.indexOf(imageExtension) === -1) {
      return Promise.reject("Invalid image format");
    }
    const image = imageBase64.trim().split("base64,")[1];
    if (
      image.length % 4 !== 0 ||
      RegExp("^[a-zA-Z0-9+/]*={0,3}$").test(image) === null
    ) {
      return Promise.reject("Invalid image");
    }
    return this.dao.loadImage(imageBase64, path);
  }

  public deleteImage(imageURL: string): Promise<void> {
    return this.dao.deleteImage(imageURL);
  }
}
