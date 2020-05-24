declare function swaggerGeneration(app: any): (options: any) => {};

declare namespace swaggerGeneration {}
declare module "express-swagger-generator" {
  export = swaggerGeneration;
}
