import { UsersDao } from "./UsersDao";
import { UsersRouter } from "./UsersRouter";
import { UsersService } from "./UsersService";

export const usersService = new UsersService({ dao: new UsersDao() });
export const usersRouter = new UsersRouter({ service: usersService }).router;
