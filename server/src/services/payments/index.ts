import { familiesService } from "@src/services/families";
import { imageManagerService } from "@src/services/image-manager";
import { usersService } from "@src/services/users";
import { PaymentsDao } from "./PaymentsDao";
import { PaymentsRouter } from "./PaymentsRouter";
import { PaymentsService } from "./PaymentsService";

export const paymentsService = new PaymentsService({
  dao: new PaymentsDao(),
  imageLoaderService: imageManagerService,
  familiesService: familiesService
});

export const paymentsRouter = new PaymentsRouter({
  service: paymentsService,
  usersService: usersService,
  familiesService: familiesService
}).router;
