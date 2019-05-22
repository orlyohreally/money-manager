import { Component, OnInit, Input } from "@angular/core";
import { MenuEntry } from "../menu-entry";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
  @Input() menuEntries: MenuEntry[];
  constructor() {}

  ngOnInit() {}

  public toDisplay(entry: MenuEntry) {
    return entry.display || entry.display === undefined;
  }
}
