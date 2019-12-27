import { Component, Input, OnChanges } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';
import { User } from '@shared/types';
import { UserManagerService } from '@src/app/core/services/user-manager/user-manager.service';

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
    this.fullName = this.userManagerService.getFullName(this.user);
  }
}
