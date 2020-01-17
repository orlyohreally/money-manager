import { EmailSenderDao } from "@src/services/email-sender/EmailSenderDao";
// tslint:disable-next-line: max-line-length
import { EmailSenderService } from "@src/services/email-sender/EmailSenderService";
import { RedisDao } from "@src/services/redis/RedisDao";
import { RedisService } from "@src/services/redis/RedisService";
import { UsersDao } from "./UsersDao";
import { UsersRouter } from "./UsersRouter";
import { UsersService } from "./UsersService";

export const usersService = new UsersService({ dao: new UsersDao() });
export const usersRouter = new UsersRouter({
  service: usersService,
  redisService: new RedisService({ dao: new RedisDao() }),
  emailSenderService: new EmailSenderService({ dao: new EmailSenderDao() })
}).router;
