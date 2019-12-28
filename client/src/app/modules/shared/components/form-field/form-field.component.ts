import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent implements OnInit {
  @Input() public label: string;
  @Input() public required: boolean;
  constructor() {}

  ngOnInit() {}
}
