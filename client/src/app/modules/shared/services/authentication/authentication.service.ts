import { Injectable } from "@angular/core";
import { User } from "@shared/types";

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  user: User;
  constructor() {
    
  }

  public getUser(): User {
    return this.user;
  }
  public isLoggedIn() {
    return this.user !== undefined;
  }

  public register(user: User) {
    this.user = user;
    console.log("new user", this.user);
  }
}
