import { EventEmitter } from "protractor";

export class HomePageSection {
  name: string;
  title: string;
  image: {
    path: string;
    link: string;
  };
  button: {
    label: string;
    classes: string;
  };
}
