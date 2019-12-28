import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'nav-side-nav-unauthenticated-user',
  templateUrl: './side-nav-unauthenticated-user.component.html',
  styleUrls: ['./side-nav-unauthenticated-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavUnauthenticatedUserComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
