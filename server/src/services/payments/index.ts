// tslint:disable-next-line: max-line-length
import { FamiliesDao } from "@src/services/families/FamiliesDao";
import { FamiliesService } from "@src/services/families/FamiliesService";
import { ImageManagerDao } from "@src/services/image-manager/ImageManagerDao";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";
import { UsersDao } from "@src/services/users/UsersDao";
import { UsersService } from "@src/services/users/UsersService";
import { Connection } from "mongoose";
import { PaymentsDao } from "./PaymentsDao";
import { PaymentsRouter } from "./PaymentsRouter";
import { PaymentsService } from "./PaymentsService";

export const paymentsService = async (db: Connection) => {
  const paymentDao = new PaymentsDao();
  await paymentDao.initView(db);
  return new PaymentsService({
    dao: paymentDao,
    imageLoaderService: new ImageManagerService({ dao: new ImageManagerDao() })
  });
};
export const paymentsRouter = async (db: Connection) => {
  return new PaymentsRouter({
    service: await paymentsService(db),
    usersService: new UsersService({
      dao: new UsersDao(),
      imageLoaderService: new ImageManagerService({
        dao: new ImageManagerDao()
      })
    }),
    familiesService: new FamiliesService({
      dao: new FamiliesDao(),
      imageLoaderService: new ImageManagerService({
        dao: new ImageManagerDao()
      })
    })
  }).router;
};
