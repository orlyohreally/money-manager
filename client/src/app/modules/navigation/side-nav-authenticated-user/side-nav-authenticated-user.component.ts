import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'nav-side-nav-authenticated-user',
  templateUrl: './side-nav-authenticated-user.component.html',
  styleUrls: ['./side-nav-authenticated-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavAuthenticatedUserComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
