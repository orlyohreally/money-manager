import { imageManagerService } from "@src/services/image-manager";
import { usersService } from "@src/services/users";
import { PaymentSubjectsDao } from "./PaymentSubjectsDao";
import { PaymentSubjectsRouter } from "./PaymentSubjectsRouter";
import { PaymentSubjectsService } from "./PaymentSubjectsService";

export const paymentSubjectsService = new PaymentSubjectsService({
  dao: new PaymentSubjectsDao(),
  imageLoaderService: imageManagerService
});
export const paymentSubjectsRouter = new PaymentSubjectsRouter({
  service: paymentSubjectsService,
  usersService: usersService
}).router;
