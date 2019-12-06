// tslint:disable-next-line: max-line-length
import { ImageManagerDao } from "@src/services/image-manager/ImageManagerDao";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";
import { UsersDao } from "@src/services/users/UsersDao";
import { UsersService } from "@src/services/users/UsersService";
import { FamiliesDao } from "./FamiliesDao";
import { FamiliesRouter } from "./FamiliesRouter";
import { FamiliesService } from "./FamiliesService";

export const familiesService = new FamiliesService({
  dao: new FamiliesDao(),
  imageLoaderService: new ImageManagerService({ dao: new ImageManagerDao() })
});
export const familiesRouter = new FamiliesRouter({
  service: familiesService,
  usersService: new UsersService({ dao: new UsersDao() })
}).router;
