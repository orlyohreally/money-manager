import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
import { User } from '@shared/types';

@Component({
  selector: 'nav-user-menu-opener',
  templateUrl: './user-menu-opener.component.html',
  styleUrls: ['./user-menu-opener.component.scss']
})
export class UserMenuOpenerComponent implements OnInit {
  loggedInUser: Observable<User>;

  constructor(
    private authenticationService: AuthenticationService,
    private userManagerService: UserManagerService
  ) {}

  ngOnInit() {
    this.authenticationService
      .tokenLoadedFromStorage()
      .pipe(
        first(),
        switchMap(() => {
          return this.userManagerService.loadUser();
        })
      )
      .subscribe();
    this.loggedInUser = this.authenticationService.getUser();
  }
}
