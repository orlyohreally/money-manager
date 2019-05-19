import { FamiliesDao as Dao } from "./FamiliesDao";
import { FamiliesService as Service } from "./FamiliesService";

export const FamiliesService = new Service({ dao: new Dao() });
