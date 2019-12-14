import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
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
