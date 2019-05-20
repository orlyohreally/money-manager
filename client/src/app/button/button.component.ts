import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"]
})
export class ButtonComponent implements OnInit {
  @Input() label: string;
  @Output() clickAction = new EventEmitter();
  @Input() classes: string;
  constructor() {}

  ngOnInit() {}

  public onClick() {
    this.clickAction.emit();
  }
}
