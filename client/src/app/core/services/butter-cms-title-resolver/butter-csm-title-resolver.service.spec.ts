import { TestBed } from '@angular/core/testing';

import { ButterCsmTitleResolverService } from './butter-csm-title-resolver.service';

describe('ButterCsmTitleResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ButterCsmTitleResolverService = TestBed.get(
      ButterCsmTitleResolverService
    );
    expect(service).toBeTruthy();
  });
});
