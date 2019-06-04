import { Component, OnInit } from "@angular/core";
import { User } from "@shared/types";
import { AuthenticationService } from "@shared-client/services/authentication/authentication.service";
import { MenuEntry } from "@shared-client/types/menu-entry";

@Component({
  selector: "navigation-user-menu",
  templateUrl: "./user-menu.component.html",
  styleUrls: ["./user-menu.component.scss"]
})
export class UserMenuComponent implements OnInit {
  public menuEntries: MenuEntry[];
  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {}

  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  public getUserFullName(): string {
    return "not implemented";
  }
}
