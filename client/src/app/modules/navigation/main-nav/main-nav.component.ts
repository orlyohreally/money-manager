import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";

@Component({
  selector: "navigation-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"]
})
export class MainNavComponent implements OnInit {
  @Input() type: string;
  @Output() toggleNavbar = new EventEmitter();
  @Output() hideNavbar = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  public toggleSidenav() {
    // TODO: remove highlight from menu button
    this.toggleNavbar.emit();
  }

  public hideSidenav() {
    this.hideNavbar.emit();
  }
}
