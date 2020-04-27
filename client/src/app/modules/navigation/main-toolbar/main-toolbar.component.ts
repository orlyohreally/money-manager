import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import { User } from '@shared/types';

@Component({
  selector: 'nav-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {
  isAuthenticated: Observable<boolean>;
  user: Observable<User>;

  @Output() toggleNavbar = new EventEmitter();

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.isAuthenticated = this.authenticationService.isAuthenticated();
  }

  public onMenuIconClick() {
    this.toggleNavbar.emit();
  }
}
