import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { User } from '@shared/types';

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
