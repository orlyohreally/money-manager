import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'nav-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {
  isAuthenticated: Observable<boolean>;

  @Output() toggleNavbar = new EventEmitter();

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.isAuthenticated = this.authenticationService.isAuthenticated();
  }

  public onMenuIconClick() {
    this.toggleNavbar.emit();
  }
}
