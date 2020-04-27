import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '@shared/types';

@Component({
  selector: 'nav-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent {
  @Input() user: User;

  constructor() {}
}
