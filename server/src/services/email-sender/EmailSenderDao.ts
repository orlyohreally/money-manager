import * as sgMail from "@sendgrid/mail";
import { RequestResponse } from "request";
import { IEmailSenderDao } from "./EmailSenderService";

export class EmailSenderDao implements IEmailSenderDao {
  constructor() {
    this.configSendGrid();
  }

  public testEmail(to: string): Promise<[RequestResponse, {}]> {
    const msg = {
      to: to,
      from: "test@example.com",
      subject: "Sending with Twilio SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>"
    };
    return sgMail.send(msg);
  }

  public sendEmail(
    templateId: string,
    to: string,
    dynamicTemplateData: { [key: string]: string | number }
  ): Promise<[RequestResponse, {}]> {
    const msg = {
      to: to,
      from: "orly.knop@gmail.com",
      templateId,
      dynamic_template_data: dynamicTemplateData
    };

    return sgMail.send(msg);
  }

  private configSendGrid() {
    sgMail.setApiKey(process.env.sendgrid_api_key as string);
  }
}
