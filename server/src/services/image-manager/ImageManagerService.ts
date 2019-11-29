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
    return this.dao.loadImage(imageBase64, path);
  }

  public deleteImage(imageURL: string): Promise<void> {
    return this.dao.deleteImage(imageURL);
  }
}
