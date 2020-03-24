// tslint:disable-next-line: max-line-length
import { EmailSenderDao } from "@src/services/email-sender/EmailSenderDao";
// tslint:disable-next-line: max-line-length
import { EmailSenderService } from "@src/services/email-sender/EmailSenderService";
import { ImageManagerDao } from "@src/services/image-manager/ImageManagerDao";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";
import { PaymentsDao } from "@src/services/payments/PaymentsDao";
import { PaymentsService } from "@src/services/payments/PaymentsService";
import { UsersDao } from "@src/services/users/UsersDao";
import { UsersService } from "@src/services/users/UsersService";
import { Connection } from "mongoose";
import { FamiliesDao } from "./FamiliesDao";
import { FamiliesRouter } from "./FamiliesRouter";
import { FamiliesService } from "./FamiliesService";

export const familiesService = async (db: Connection) => {
  const familiesDao = new FamiliesDao();
  await familiesDao.initViews(db);
  return new FamiliesService({
    dao: familiesDao,
    imageLoaderService: new ImageManagerService({ dao: new ImageManagerDao() })
  });
};

export const familiesRouter = async (db: Connection) => {
  return new FamiliesRouter({
    service: await familiesService(db),
    usersService: new UsersService({ dao: new UsersDao() }),
    emailSenderService: new EmailSenderService({ dao: new EmailSenderDao() }),
    paymentsService: new PaymentsService({
      dao: new PaymentsDao(),
      imageLoaderService: new ImageManagerService({
        dao: new ImageManagerDao()
      })
    })
  }).router;
};
