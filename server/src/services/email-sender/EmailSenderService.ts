export interface IEmailSenderDao {
  sendEmail(
    templateId: string,
    to: string,
    dynamicTemplateData: { [key: string]: string | number }
  ): Promise<void>;
}

export class EmailSenderService {
  private dao: IEmailSenderDao;

  constructor({ dao }: { dao: IEmailSenderDao }) {
    this.dao = dao;
  }

  public sendEmail(
    templateId: string,
    to: string,
    dynamicTemplateData: { [key: string]: string | number }
  ): Promise<void> {
    const emailingEnabled: boolean = process.env.EMAILING_ENABLED === "true";
    if (!emailingEnabled) {
      return Promise.resolve();
    }
    return this.dao.sendEmail(templateId, to, dynamicTemplateData);
  }
}
