import * as redis from "redis";
import { IRedisDao } from "./RedisService";

export class RedisDao implements IRedisDao {
  private client: redis.RedisClient;

  constructor() {
    this.client = redis.createClient();
  }

  public set(key: string, value: string): Promise<void> {
    return new Promise((resolve, rejects) => {
      return this.client.set(key, value, error => {
        if (error) {
          rejects(error);
        }
        resolve();
      });
    });
  }

  public get(key: string): Promise<string> {
    return new Promise((resolve, rejects) => {
      return this.client.get(key, (error, value) => {
        if (error) {
          rejects(error);
        }
        resolve(value);
      });
    });
  }

  public remove(key: string): Promise<void> {
    return new Promise((resolve, rejects) => {
      return this.client.del(key, error => {
        if (error) {
          rejects(error);
        }
        resolve();
      });
    });
  }
}
