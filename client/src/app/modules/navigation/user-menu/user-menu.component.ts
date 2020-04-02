import { Component, Input, OnChanges } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
import { User } from '@shared/types';

@Component({
  selector: 'nav-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnChanges {
  @Input() user: User;

  backgroundImg: SafeStyle;
  fullName: string;

  constructor(private userManagerService: UserManagerService) {}

  ngOnChanges(): void {
    const userIcon = this.userManagerService.getUserIcon(this.user);
    this.backgroundImg = `url('${userIcon}')`;
  }
}
