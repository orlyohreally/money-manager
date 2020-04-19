import { EmailSenderDao } from "@src/services/email-sender/EmailSenderDao";
// tslint:disable-next-line: max-line-length
import { EmailSenderService } from "@src/services/email-sender/EmailSenderService";

export const emailSenderService = new EmailSenderService({
  dao: new EmailSenderDao()
});
