import { TestBed } from '@angular/core/testing';

import { PaymentSubjectsService } from './payment-subjects.service';

describe('PaymentSubjectsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentSubjectsService = TestBed.get(PaymentSubjectsService);
    expect(service).toBeTruthy();
  });
});
