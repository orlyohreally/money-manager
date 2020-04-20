import { RedisDao } from "@src/services/redis/RedisDao";
import { RedisService } from "@src/services/redis/RedisService";

export const redisService = new RedisService({
  dao: new RedisDao()
});
