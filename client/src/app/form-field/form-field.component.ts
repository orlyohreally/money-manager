import { Component, OnInit, Input } from "@angular/core";
import { RequiredValidator } from "@angular/forms";

@Component({
  selector: "app-form-field",
  templateUrl: "./form-field.component.html",
  styleUrls: ["./form-field.component.scss"]
})
export class FormFieldComponent implements OnInit {
  @Input() label: string;
  @Input() required: boolean;
  constructor() {}

  ngOnInit() {
    console.log("required", this.required);
  }
}
