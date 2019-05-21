import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HtmlElementRepresentation } from "../html-element";

@Component({
  selector: "app-html-element-select",
  templateUrl: "./html-element-select.component.html",
  styleUrls: ["./html-element-select.component.scss"]
})
export class HtmlElementSelectComponent implements OnInit {
  @Input() elements: HtmlElementRepresentation[];
  @Output() clickAction = new EventEmitter();
  selected: HtmlElementRepresentation;

  constructor() {}

  ngOnInit() {
    console.log(this.elements);
    this.selected = this.elements[0];
  }

  public onClick(element: HtmlElementRepresentation) {
    this.selected = element;
    this.clickAction.emit(element);
  }
}
