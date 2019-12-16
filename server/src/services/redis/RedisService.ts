export interface IRedisDao {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string>;
  remove(key: string): Promise<void>;
}

export class RedisService {
  private dao: IRedisDao;

  constructor({ dao }: { dao: IRedisDao }) {
    this.dao = dao;
  }

  public set(key: string, value: string): Promise<void> {
    return this.dao.set(key, value);
  }

  public get(key: string): Promise<string> {
    return this.dao.get(key);
  }

  public remove(key: string): Promise<void> {
    return this.dao.remove(key);
  }
}
