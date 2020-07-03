import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { getGlobalVariablesServiceSpy } from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { SupportService } from './support.service';

describe('SupportService', () => {
  let service: SupportService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: GlobalVariablesService,
          useValue: getGlobalVariablesServiceSpy()
        }
      ]
    });
    service = TestBed.get(SupportService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // tslint:disable-next-line: max-line-length
  it('contactSupport should make POST http request to apiURL/support/contact', () => {
    const mockedContactMessage = {
      email: 'email@handle.com',
      subject: 'Not working',
      message: 'Members are not displaying correctly',
      'g-recaptcha-response': 'recaptcha'
    };
    const mockedResponse = { message: 'We will get in touch' };

    service.contactSupport(mockedContactMessage).subscribe(response => {
      expect(response).toEqual(mockedResponse);
    });

    const req = httpTestingController.expectOne({
      url: 'apiURL/support/contact',
      method: 'POST'
    });
    expect(req.request.body).toBe(mockedContactMessage);

    req.flush(mockedResponse);
  });
});
