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
    @Inject('windowObj') private window: WindowWithGA,
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

  event<T>(name: string, data: T) {
    if (!this.isDevModeService.isDevMode()) {
      this.window.gtag('event', name, data);
    }
  }
}
