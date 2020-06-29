import * as Joi from "@hapi/joi";

export class SupportService {
  public validateMessageToSupport(
    email: string,
    subject: string,
    message: string
  ): Joi.ValidationResult {
    console.log(email, subject, message);

    const schema = Joi.object({
      email: Joi.string()
        .min(5)
        .max(255)
        .email()
        .required(),
      subject: Joi.string()
        .max(20)
        .required(),
      message: Joi.string()
        .min(10)
        .max(1000)
        .required()
    });
    return schema.validate({ email, subject, message });
  }
}
