import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
  menuEntries = [
    {
      _id: 'payments',
      label: 'Payments',
      items: [{ label: 'List of payments', link: '/payments' }]
    },
    {
      _id: 'members',
      label: 'Members',
      items: [{ label: 'List of members', link: '/members' }]
    }
  ];
  constructor() {}

  ngOnInit() {}
}
