import { RedisDao } from "@src/services/redis/RedisDao";
import { RedisService } from "@src/services/redis/RedisService";
import { UsersDao } from "./UsersDao";
import { UsersRouter } from "./UsersRouter";
import { UsersService } from "./UsersService";

export const usersService = new UsersService({ dao: new UsersDao() });
export const usersRouter = new UsersRouter({
  service: usersService,
  redisService: new RedisService({ dao: new RedisDao() })
}).router;
