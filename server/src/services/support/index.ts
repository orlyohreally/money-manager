import { emailSenderService } from "@src/services/email-sender";
import { SupportRouter } from "./SupportRouter";
import { SupportService } from "./SupportService";

export const supportService = new SupportService();

export const supportRouter = new SupportRouter({
  emailSenderService: emailSenderService,
  service: supportService
}).router;
