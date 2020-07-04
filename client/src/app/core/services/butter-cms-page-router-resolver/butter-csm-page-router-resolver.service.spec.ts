import { TestBed } from '@angular/core/testing';

// tslint:disable-next-line: max-line-length
import { ButterCsmPageRouterResolverService } from './butter-csm-page-router-resolver.service';

describe('ButterCsmPageRouterResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ButterCsmPageRouterResolverService = TestBed.get(
      ButterCsmPageRouterResolverService
    );
    expect(service).toBeTruthy();
  });
});
