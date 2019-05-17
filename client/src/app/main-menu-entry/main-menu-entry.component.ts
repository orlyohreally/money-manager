import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-main-menu-entry',
  templateUrl: './main-menu-entry.component.html',
  styleUrls: ['./main-menu-entry.component.scss']
})
export class MainMenuEntryComponent implements OnInit {
  @Input() entry;
  constructor() {}

  ngOnInit() {}
}
