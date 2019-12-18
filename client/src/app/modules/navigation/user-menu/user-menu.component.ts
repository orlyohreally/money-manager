import { Component, OnInit, Sanitizer } from '@angular/core';
import { User } from '@shared/types';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'nav-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  backgroundImg: SafeStyle;

  private user: User;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.backgroundImg = this.sanitizer.bypassSecurityTrustStyle(
      `url(${
        this.user && this.user.icon ? this.user.icon : '/assets/images/cat.jpg'
      })`
    );
  }

  getUserFullName(): string {
    return 'Ivanov Peter';
  }
}
