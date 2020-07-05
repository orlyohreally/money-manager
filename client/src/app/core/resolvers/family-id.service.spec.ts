import { TestBed } from '@angular/core/testing';

import { FamilyIdService } from './family-id.service';

describe('FamilyIdService', () => {
  let service: FamilyIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
