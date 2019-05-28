import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { OuterSubscriber } from "rxjs/internal/OuterSubscriber";

@Component({
  selector: "navigation-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"]
})
export class SideNavComponent implements OnInit {
  @Output() hideSidebar = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  onLinkClick() {
    this.hideSidebar.emit();
  }
}
