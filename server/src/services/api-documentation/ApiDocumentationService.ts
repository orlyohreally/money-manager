import * as definitionsJson from "./options.json";

export class ApiDocumentationService {
  public options = {
    ...definitionsJson,
    basedir: `${__dirname}/../..`
  };
}
