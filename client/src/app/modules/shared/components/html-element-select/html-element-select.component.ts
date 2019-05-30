import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HtmlElementRepresentation } from "@shared-client/types/html-element";

@Component({
  selector: "shared-html-element-select",
  templateUrl: "./html-element-select.component.html",
  styleUrls: ["./html-element-select.component.scss"]
})
export class HtmlElementSelectComponent implements OnInit {
  @Input() elements: HtmlElementRepresentation[];
  @Output() clickAction = new EventEmitter();
  selected: HtmlElementRepresentation;

  constructor() {}

  ngOnInit() {
    this.selected = this.elements[0];
  }

  public onClick(element: HtmlElementRepresentation) {
    this.selected = element;
    this.clickAction.emit(element);
  }
}
