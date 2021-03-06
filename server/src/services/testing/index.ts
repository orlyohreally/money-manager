// tslint:disable-next-line: max-line-length
import { familiesService } from "@src/services/families";
import { paymentSubjectsService } from "@src/services/payment-subjects";
import { paymentsService } from "@src/services/payments";
import { TestingRouter } from "@src/services/testing/TestingRouter";
import { TestingService } from "@src/services/testing/TestingService";
import { usersService } from "@src/services/users";

export const testingService = new TestingService({
  paymentSubjectsService: paymentSubjectsService
});
export const testingRouter = new TestingRouter({
  service: testingService,
  usersService: usersService,
  familiesService: familiesService,
  paymentsService: paymentsService
}).router;
