import { User } from "@shared/types";
import { UserModel } from "./models";
import { IUsersDao } from "./UsersService";

export class UsersDao implements IUsersDao {
  public async createUser(user: User): Promise<User> {
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser.toJSON() as User;
  }
}
