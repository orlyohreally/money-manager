import { RequestResponse } from "request";

export interface IEmailSenderDao {
  sendEmail(
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
    to: string,
    dynamicTemplateData: { [key: string]: string | number }
  ): Promise<[RequestResponse, {}]> {
    return this.dao.sendEmail(to, dynamicTemplateData);
  }
}
