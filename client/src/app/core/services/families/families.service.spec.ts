import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IPaymentsServiceMock, PaymentsServiceMock } from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { PaymentsService } from '../payments/payments.service';
import { FamiliesService } from './families.service';

describe('FamiliesService', () => {
  let service: FamiliesService;
  let httpTestingController: HttpTestingController;

  const paymentsServiceMock: IPaymentsServiceMock = PaymentsServiceMock();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: GlobalVariablesService, useValue: { apiURL: 'apiURL' } },
        { provide: PaymentsService, useValue: paymentsServiceMock.service }
      ]
    });
    service = TestBed.get(FamiliesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
