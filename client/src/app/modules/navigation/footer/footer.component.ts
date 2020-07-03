import { Component, OnInit } from '@angular/core';
import { IsDevModeService } from '@src/app/core/services/is-dev-mode.service';

@Component({
  selector: 'nav-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isDev: boolean;
  copyrightDuration: string;

  private startYear = 2019;

  constructor(private dev: IsDevModeService) {
    this.isDev = this.dev.isDevMode();
  }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.copyrightDuration = `${this.startYear}${
      currentYear > this.startYear ? ` - ${currentYear}` : ''
    }`;
  }
}
