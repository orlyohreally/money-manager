import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '@shared/types';
import { AuthenticationService } from '@src/app/core/services/authentication/authentication.service';
import { UserManagerService } from '@src/app/core/services/user-manager/user-manager.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'nav-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {
  isAuthenticated: Observable<boolean>;
  user: Observable<User>;
  @Output() toggleNavbar = new EventEmitter();

  constructor(
    private authenticationService: AuthenticationService,
    private userManagerService: UserManagerService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authenticationService.isAuthenticated();
    this.user = this.userManagerService.loadUser();
  }

  public onMenuIconClick() {
    this.toggleNavbar.emit();
  }
}
