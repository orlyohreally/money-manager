import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@src/app/core/services/authentication/authentication.service';

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
