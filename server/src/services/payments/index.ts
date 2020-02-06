// tslint:disable-next-line: max-line-length
import { FamiliesDao } from "@src/services/families/FamiliesDao";
import { FamiliesService } from "@src/services/families/FamiliesService";
import { ImageManagerDao } from "@src/services/image-manager/ImageManagerDao";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";
import { UsersDao } from "@src/services/users/UsersDao";
import { UsersService } from "@src/services/users/UsersService";
import { PaymentsDao } from "./PaymentsDao";
import { PaymentsRouter } from "./PaymentsRouter";
import { PaymentsService } from "./PaymentsService";

export const paymentsService = new PaymentsService({
  dao: new PaymentsDao(),
  imageLoaderService: new ImageManagerService({ dao: new ImageManagerDao() })
});
export const paymentsRouter = new PaymentsRouter({
  service: paymentsService,
  usersService: new UsersService({ dao: new UsersDao() }),
  familiesService: new FamiliesService({
    dao: new FamiliesDao(),
    imageLoaderService: new ImageManagerService({ dao: new ImageManagerDao() })
  })
}).router;
