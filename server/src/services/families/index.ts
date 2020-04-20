import { emailSenderService } from "@src/services/email-sender";
import { imageManagerService } from "@src/services/image-manager";
import { usersService } from "@src/services/users";
import { FamiliesDao } from "./FamiliesDao";
import { FamiliesRouter } from "./FamiliesRouter";
import { FamiliesService } from "./FamiliesService";

export const familiesService = new FamiliesService({
  dao: new FamiliesDao(),
  imageLoaderService: imageManagerService
});

export const familiesRouter = new FamiliesRouter({
  service: familiesService,
  usersService: usersService,
  emailSenderService: emailSenderService
}).router;
