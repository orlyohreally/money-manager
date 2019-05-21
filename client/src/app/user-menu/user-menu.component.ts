import { Component, OnInit } from "@angular/core";
import { User } from "@shared/types";
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: "app-user-menu",
  templateUrl: "./user-menu.component.html",
  styleUrls: ["./user-menu.component.scss"]
})
export class UserMenuComponent implements OnInit {
  public user: User;
  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.user = this.authenticationService.getUser();
  }
}
