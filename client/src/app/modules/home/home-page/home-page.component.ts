import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';

@Component({
  selector: 'home-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  isAuthenticated: Observable<boolean>;

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
  }
}
