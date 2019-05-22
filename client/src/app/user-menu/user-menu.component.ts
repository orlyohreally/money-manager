import { Component, OnInit } from "@angular/core";
import { User } from "@shared/types";
import { AuthenticationService } from "../authentication.service";
import { MenuEntry } from "../menu-entry";
import { MembersService } from "../members.service";

@Component({
  selector: "app-user-menu",
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
    this.menuEntries = [
      {
        _id: "user",
        label: this.getUserFullName(),
        display: this.isLoggedIn(),
        icon: "person",
        items: [
          { _id: "payments-list", label: "List of payments", link: "/payments" }
        ]
      },
      {
        _id: "user",
        label: "Guest",
        display: !this.isLoggedIn(),
        icon: "person",
        items: [
          { _id: "payments-list", label: "List of payments", link: "/payments" }
        ]
      }
    ];
  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  private getUserFullName() {
    return this.isLoggedIn()
      ? this.membersService.getMemberFullName(this.user)
      : null;
  }
}
