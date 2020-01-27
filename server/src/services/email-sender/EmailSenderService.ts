import { RequestResponse } from "request";

export interface IEmailSenderDao {
  sendEmail(
    templateId: string,
    to: string,
    dynamicTemplateData: { [key: string]: string | number }
  ): Promise<[RequestResponse, {}]>;
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
  ): Promise<[RequestResponse, {}]> {
    return this.dao.sendEmail(templateId, to, dynamicTemplateData);
  }
}
