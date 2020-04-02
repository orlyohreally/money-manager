import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { PaymentSubjectsService } from './payment-subjects.service';

describe('PaymentSubjectsService', () => {
  let service: PaymentSubjectsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: GlobalVariablesService, useValue: { apiURL: 'apiURL' } }
      ]
    });
    service = TestBed.get(PaymentSubjectsService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
