import { Inject, Injectable, isDevMode } from '@angular/core';

import { WindowWithGA } from '@src/app/types';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { IsDevModeService } from '../is-dev-mode.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  constructor(
    @Inject('windowObj')
    private window: Window & { gtag: (a, b, c, d?, e?, f?) => void },
    private globalVariablesService: GlobalVariablesService,
    private isDevModeService: IsDevModeService
  ) {}

  config(data: { [property: string]: string }) {
    if (!this.isDevModeService.isDevMode()) {
      this.window.gtag(
        'config',
        this.globalVariablesService.gaMeasurementId,
        data
      );
    }
  }

  event(
    name: string,
    data: {
      eventCategory?: string;
      eventLabel?: string;
      eventAction?: string;
      eventValue?: string | number;
    }
  ) {
    if (!this.isDevModeService.isDevMode()) {
      this.window.gtag(
        'send',
        'event',
        data.eventCategory,
        data.eventLabel,
        data.eventAction,
        data.eventValue
      );
    }
  }
}
