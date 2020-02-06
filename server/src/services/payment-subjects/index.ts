// tslint:disable-next-line: max-line-length
import { ImageManagerDao } from "@src/services/image-manager/ImageManagerDao";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";
import { UsersDao } from "@src/services/users/UsersDao";
import { UsersService } from "@src/services/users/UsersService";
import { PaymentSubjectsDao } from "./PaymentSubjectsDao";
import { PaymentSubjectsRouter } from "./PaymentSubjectsRouter";
import { PaymentSubjectsService } from "./PaymentSubjectsService";

export const paymentSubjectsService = new PaymentSubjectsService({
  dao: new PaymentSubjectsDao(),
  imageLoaderService: new ImageManagerService({ dao: new ImageManagerDao() })
});
export const paymentSubjectsRouter = new PaymentSubjectsRouter({
  service: paymentSubjectsService,
  usersService: new UsersService({ dao: new UsersDao() })
}).router;
