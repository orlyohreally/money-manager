declare function emailCheck(app: any): Promise<boolean>;

declare namespace emailCheck {}
declare module "email-check" {
  export = emailCheck;
}
