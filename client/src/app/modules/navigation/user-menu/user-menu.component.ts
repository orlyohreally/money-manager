import { Component, OnInit } from "@angular/core";
import { User } from "@shared/types";
import { AuthenticationService } from "@shared-client/services/authentication/authentication.service";
import { MenuEntry } from "@shared-client/types/menu-entry";
import { MembersService } from "@shared-client/services/members/members.service";

@Component({
  selector: "navigation-user-menu",
  templateUrl: "./user-menu.component.html",
  styleUrls: ["./user-menu.component.scss"]
})
export class UserMenuComponent implements OnInit {
  public user: User;
  public menuEntries: MenuEntry[];
  constructor(
    private authenticationService: AuthenticationService,
    private membersService: MembersService
  ) {}

  ngOnInit() {
    this.user = this.authenticationService.getUser();
  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  public getUserFullName() {
    return this.isLoggedIn()
      ? this.membersService.getMemberFullName(this.user)
      : "Guest";
  }
}
