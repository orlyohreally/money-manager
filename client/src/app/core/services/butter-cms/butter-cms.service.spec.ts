import { TestBed } from '@angular/core/testing';

import { ButterCMSService } from './butter-cms.service';

describe('ButterCMSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ButterCMSService = TestBed.get(ButterCMSService);
    expect(service).toBeTruthy();
  });
});
