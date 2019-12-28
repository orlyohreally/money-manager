import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'nav-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  isAuthenticated: Observable<boolean>;

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
  }
}
