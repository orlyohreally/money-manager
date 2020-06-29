import * as sgMail from "@sendgrid/mail";

import { IEmailSenderDao } from "./EmailSenderService";

export class EmailSenderDao implements IEmailSenderDao {
  public async sendEmail(
    templateId: string,
    to: string,
    dynamicTemplateData: { [key: string]: string | number }
  ): Promise<void> {
    this.configSendGrid();
    const msg = {
      to: to,
      from: "orly.knop@gmail.com",
      templateId,
      dynamic_template_data: dynamicTemplateData
    };

    await sgMail.send(msg);
  }

  private configSendGrid() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }
}
