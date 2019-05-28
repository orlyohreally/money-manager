import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "navigation-side-nav-block",
  templateUrl: "./side-nav-block.component.html",
  styleUrls: ["./side-nav-block.component.scss"]
})
export class SideNavBlockComponent implements OnInit {
  @Input() public blockLabel: string;
  public collapsed = false;

  constructor() {}

  ngOnInit() {}

  public toggleNavBlock() {
    this.collapsed = !this.collapsed;
  }
}
