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
    private window: WindowWithGA,
    private globalVariablesService: GlobalVariablesService,
    private isDevModeService: IsDevModeService
  ) {}

  config(data: { [property: string]: string }) {
    if (
      !this.isDevModeService.isDevMode() &&
      this.globalVariablesService.name === 'production'
    ) {
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
      eventValue?: number;
    }
  ) {
    if (
      !this.isDevModeService.isDevMode() &&
      this.globalVariablesService.name === 'production'
    ) {
      this.window.gtag('event', name, {
        event_category: data.eventCategory,
        event_label: data.eventLabel,
        event_action: data.eventAction,
        event_value: data.eventValue
      });
    }
  }
}
