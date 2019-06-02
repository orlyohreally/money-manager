import { User } from "@shared/types";

export interface IUsersDao {
  createUser(user: User): Promise<User>;
}

export class UsersService {
  private dao: IUsersDao;

  constructor({ dao }: { dao: IUsersDao }) {
    this.dao = dao;
  }

  public async createUser(user: User): Promise<User> {
    return this.dao.createUser(user);
  }
}
