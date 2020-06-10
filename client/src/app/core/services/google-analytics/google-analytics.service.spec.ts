import { TestBed } from '@angular/core/testing';

import { WindowWithGA } from '@src/app/types';
import { getGlobalVariablesServiceSpy } from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { IsDevModeService } from '../is-dev-mode.service';
import { GoogleAnalyticsService } from './google-analytics.service';

describe('GoogleAnalyticsService', () => {
  let service: GoogleAnalyticsService;
  let windowSpy: jasmine.SpyObj<WindowWithGA>;

  beforeEach(() => {
    windowSpy = jasmine.createSpyObj('Window', { gtag });
    TestBed.configureTestingModule({
      providers: [
        { provide: 'windowObj', useValue: windowSpy },
        {
          provide: GlobalVariablesService,
          useValue: getGlobalVariablesServiceSpy()
        },
        {
          provide: IsDevModeService,
          useValue: { isDevMode: () => false }
        }
      ]
    });

    service = TestBed.get(GoogleAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('config should call window.gtag("config", measureId, data)', () => {
    const mockedData = { page_path: '/' };
    service.config(mockedData);
    expect(windowSpy.gtag).toHaveBeenCalledTimes(1);
    expect(windowSpy.gtag).toHaveBeenCalledWith(
      'config',
      'gaMeasurementId',
      mockedData
    );
  });

  it('event should call window.gtag("event", eventName, data)', () => {
    const mockedData = { email: 'email@example.com' };
    const mockedEventName = 'login';
    service.event(mockedEventName, mockedData);
    expect(windowSpy.gtag).toHaveBeenCalledTimes(1);
    expect(windowSpy.gtag).toHaveBeenCalledWith(
      'event',
      mockedEventName,
      mockedData
    );
  });

  function gtag(name: string, measureId: string);
  function gtag<T>(type: string, name: string, data?: T) {}
});
