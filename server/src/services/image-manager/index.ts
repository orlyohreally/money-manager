import { ImageManagerDao } from "@src/services/image-manager/ImageManagerDao";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";

export const imageManagerService = new ImageManagerService({
  dao: new ImageManagerDao()
});
