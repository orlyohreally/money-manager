import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'nav-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {
  @Output() toggleNavbar = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  public onMenuIconClick() {
    this.toggleNavbar.emit();
  }
}
