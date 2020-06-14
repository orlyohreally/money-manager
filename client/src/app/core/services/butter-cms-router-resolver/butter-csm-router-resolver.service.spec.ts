import { TestBed } from '@angular/core/testing';

import { ButterCsmRouterResolverService } from './butter-csm-router-resolver.service';

describe('ButterCsmRouterResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ButterCsmRouterResolverService = TestBed.get(ButterCsmRouterResolverService);
    expect(service).toBeTruthy();
  });
});
