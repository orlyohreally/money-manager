import { TestBed } from '@angular/core/testing';

// tslint:disable-next-line: max-line-length
import { ButterCsmPageSeoResolverService } from './butter-csm-page-title-resolver.service';

describe('ButterCsmPageTitleResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ButterCsmPageSeoResolverService = TestBed.get(
      ButterCsmPageSeoResolverService
    );
    expect(service).toBeTruthy();
  });
});
