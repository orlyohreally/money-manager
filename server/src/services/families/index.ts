import { FamiliesDao } from "./FamiliesDao";
import { FamiliesRouter } from "./FamiliesRouter";
import { FamiliesService } from "./FamiliesService";
import { ImageManagerService } from "../image-manager/ImageManagerService";
import { ImageManagerDao } from "../image-manager/ImageManagerDao";

export const familiesService = new FamiliesService({
  dao: new FamiliesDao(),
  imageLoaderService: new ImageManagerService({ dao: new ImageManagerDao() })
});
export const familiesRouter = new FamiliesRouter({ service: familiesService })
  .router;
