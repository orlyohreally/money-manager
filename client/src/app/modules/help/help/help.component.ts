import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { ButterCMSService } from '@core-client/services/butter-cms/butter-cms.service';
import { IsDevModeService } from '@src/app/core/services/is-dev-mode.service';
import { Page } from '@src/app/types';

@Component({
  selector: 'help-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  isActive = false;
  helpLinks: Observable<Page[]>;
  guidePageType = 'family-expenses-guide';
  isDevMode = this.isDevModeService.isDevMode();

  constructor(
    private butterCMSService: ButterCMSService,
    private isDevModeService: IsDevModeService
  ) {}

  ngOnInit() {
    this.helpLinks = this.butterCMSService
      .getPages(this.guidePageType, 'en', 1, 5)
      .pipe(
        map(data => {
          return data.data;
        })
      );
  }

  toggleHelp() {
    this.isActive = !this.isActive;
  }
}
