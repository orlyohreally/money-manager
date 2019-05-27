import { TestBed } from '@angular/core/testing';

import { ImageAssetService } from './image-asset.service';

describe('ImageAssetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageAssetService = TestBed.get(ImageAssetService);
    expect(service).toBeTruthy();
  });
});
