import { Component, OnInit } from '@angular/core';
import { Page } from '@src/app/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { ButterCMSService } from '@core-client/services/butter-cms/butter-cms.service';

@Component({
  selector: 'help-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  isActive = false;
  helpLinks: Observable<Page[]>;
  guidePageType = 'family-expenses-guide';

  constructor(private butterCMSService: ButterCMSService) {}

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
