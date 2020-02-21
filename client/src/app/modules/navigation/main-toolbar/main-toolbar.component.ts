import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
import { User } from '@shared/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    this.isAuthenticated = this.authenticationService.isAuthenticated().pipe(
      map((authenticated: boolean) => {
        this.user = this.userManagerService.loadUser();
        return authenticated;
      })
    );
  }

  public onMenuIconClick() {
    this.toggleNavbar.emit();
  }
}
