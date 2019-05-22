import { FamiliesDao } from "./FamiliesDao";
import { FamiliesRouter } from "./FamiliesRouter";
import { FamiliesService } from "./FamiliesService";

export const familiesService = new FamiliesService({ dao: new FamiliesDao() });
export const familiesRouter = new FamiliesRouter({ service: familiesService })
  .router;
