import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-menu-entry',
  templateUrl: './menu-entry.component.html',
  styleUrls: ['./menu-entry.component.scss']
})
export class MenuEntryComponent implements OnInit {
  @Input() entry;
  constructor() {}

  ngOnInit() {}
}
