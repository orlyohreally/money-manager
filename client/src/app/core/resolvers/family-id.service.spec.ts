import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  Data
} from '@angular/router';

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

  it('resolve should return familyId from route', () => {
    expect(
      service.resolve(
        {
          parent: {
            parent: {
              paramMap: convertToParamMap({ familyId: 'familyId-1' }) as Data
            }
          } as ActivatedRouteSnapshot
        } as ActivatedRouteSnapshot,
        null
      )
    ).toBe('familyId-1');
  });
});
