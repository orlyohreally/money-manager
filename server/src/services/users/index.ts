// tslint:disable-next-line: max-line-length
import { emailSenderService } from "@src/services/email-sender";
import { imageManagerService } from "@src/services/image-manager";
import { redisService } from "@src/services/redis";
import { UsersDao } from "./UsersDao";
import { UsersRouter } from "./UsersRouter";
import { UsersService } from "./UsersService";

export const usersService = new UsersService({
  dao: new UsersDao(),
  imageLoaderService: imageManagerService
});
export const usersRouter = new UsersRouter({
  service: usersService,
  redisService: redisService,
  emailSenderService: emailSenderService
}).router;
