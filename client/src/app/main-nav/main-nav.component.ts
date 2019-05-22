import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { MenuEntry } from "../menu-entry";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"]
})
export class MainNavComponent implements OnInit {
  mainMenuEntries: MenuEntry[];
  @Output() showNavbar = new EventEmitter();
  constructor() {}

  ngOnInit() {
    this.mainMenuEntries = [
      {
        _id: "payments",
        label: "Payments",
        items: [
          {
            _id: "new-payment",
            label: "New payment"
          },
          { _id: "payments-list", label: "List of payments", link: "/payments" }
        ]
      },
      {
        _id: "members",
        label: "Members",
        items: [
          { _id: "members-list", label: "List of members", link: "/members" }
        ]
      }
    ];
  }

  public toggleNavbar() {
    this.showNavbar.emit();
  }
}
