import { Request, Response, Router } from "express";
import { RecaptchaV2 } from "express-recaptcha";
import { IRouter } from "express-serve-static-core";

// tslint:disable-next-line: max-line-length
import { EmailSenderService } from "@src/services/email-sender/EmailSenderService";
import { asyncWrap } from "@src/utils";
import { SupportService } from "./SupportService";

export class SupportRouter {
  public router: IRouter;
  public service: SupportService;
  private emailService: EmailSenderService;

  constructor({
    emailSenderService,
    service
  }: {
    emailSenderService: EmailSenderService;
    service: SupportService;
  }) {
    this.router = Router();
    this.service = service;
    this.emailService = emailSenderService;

    const recaptcha = new RecaptchaV2(
      process.env.CAPTCHA_SITE_KEY as string,
      process.env.CAPTCHA_SECRET_KEY as string
    );

    this.router.post(
      "/support/contact",
      recaptcha.middleware.verify,
      asyncWrap(this.contactSupport)
    );
  }

  private contactSupport = async (req: Request, res: Response) => {
    try {
      if (!req.recaptcha || req.recaptcha.error) {
        return res
          .status(400)
          .json({ message: "Recaptcha was not provided or is invalid" });
      }
      const { email, subject, message } = req.body as {
        email: string;
        subject: string;
        message: string;
      };

      const { error } = this.service.validateMessageToSupport(
        email,
        subject,
        message
      );
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      if (!(await this.emailService.isValidEmail(email))) {
        return res.status(400).json({ message: "email is invalid" });
      }
      await this.emailService.sendEmail(
        process.env.contact_support_email_template as string,
        "orly.knop@gmail.com",
        { email, subject, message }
      );
      return res.status(200).json({
        message:
          "We have received your message and will contact you as soon as possible."
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  };
}
