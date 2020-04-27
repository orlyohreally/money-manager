import { Component, Input, OnInit } from '@angular/core';

export interface MenuEntry {
  icon: string;
  link: string;
  label: string;
  items?: MenuEntry[];
}

@Component({
  selector: 'shared-menu-entry',
  templateUrl: './menu-entry.component.html',
  styleUrls: ['./menu-entry.component.scss']
})
export class MenuEntryComponent implements OnInit {
  @Input() entry: MenuEntry;

  constructor() {}

  ngOnInit() {}
}
