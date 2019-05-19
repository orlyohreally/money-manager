import { Injectable } from "@angular/core";
import { User } from "@shared/types";

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  constructor() {}

  public getUser(): User {
    return {
      _id: "2",
      firstName: "Orly",
      lastName: "Knop",
      colorScheme: "accent"
    };
  }
}
