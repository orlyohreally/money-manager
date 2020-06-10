// tslint:disable-next-line: max-line-length
import { GoogleAnalyticsService } from '@core-client/services/google-analytics/google-analytics.service';

function getGoogleAnalyticsServiceSpy() {
  // tslint:disable-next-line: max-line-length
  const GoogleAnalyticsServiceSpy: jasmine.SpyObj<GoogleAnalyticsService> = jasmine.createSpyObj(
    'GoogleAnalyticsService',
    ['config', 'event']
  );

  return GoogleAnalyticsServiceSpy;
}

export interface IGoogleAnalyticsServiceMock {
  getService: () => jasmine.SpyObj<GoogleAnalyticsService>;
}

// tslint:disable-next-line: max-line-length
export const GoogleAnalyticsServiceMock: () => IGoogleAnalyticsServiceMock = () => ({
  getService: getGoogleAnalyticsServiceSpy
});
