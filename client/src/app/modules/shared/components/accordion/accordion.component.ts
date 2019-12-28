import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {
  @Input() toggleLabel: string;
  @Input() collapsed: boolean;

  constructor() {}

  ngOnInit() {}

  public toggle() {
    this.collapsed = !this.collapsed;
  }
}
