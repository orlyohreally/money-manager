import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { MenuEntry } from "@shared-client/types/menu-entry";

@Component({
  selector: "navigation-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"]
})
export class MainNavComponent implements OnInit {
  @Input() showMenuMenu: boolean;
  @Output() showNavbar = new EventEmitter();
  constructor() {}

  ngOnInit() {
    this.showMenuMenu =
      typeof this.showMenuMenu === undefined || this.showMenuMenu;
    console.log(
      "showmenu",
      this.showMenuMenu,
      this.showMenuMenu === undefined,
      this.showMenuMenu === undefined || this.showMenuMenu
    );
  }

  public toggleNavbar() {
    this.showNavbar.emit();
  }
}
