import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "shared-accordion",
  templateUrl: "./accordion.component.html",
  styleUrls: ["./accordion.component.scss"]
})
export class AccordionComponent implements OnInit {
  @Input() public toggleLabel: string;
  public collapsed = false;

  constructor() {}

  ngOnInit() {}

  public toggle() {
    this.collapsed = !this.collapsed;
  }
}
