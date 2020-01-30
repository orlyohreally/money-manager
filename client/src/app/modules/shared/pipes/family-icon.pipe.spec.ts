import { TestBed } from '@angular/core/testing';
import { FamilyIconPipe } from './family-icon.pipe';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { Family } from '@shared/types';

describe('FamilyIconPipe', () => {
  let familiesServiceSpy: jasmine.SpyObj<FamiliesService>;
  beforeEach(() => {
    familiesServiceSpy = jasmine.createSpyObj('FamiliesService', [
      'getFamilyIcon'
    ]);
    familiesServiceSpy.getFamilyIcon.and.returnValue('familyIcon');
    TestBed.configureTestingModule({
      providers: [{ provide: FamiliesService, useValue: familiesServiceSpy }]
    });
  });

  it('create an instance', () => {
    const pipe = new FamilyIconPipe(familiesServiceSpy);
    expect(pipe).toBeTruthy();
  });

  it('transform should call familiesService.getFamilyIcon', () => {
    const pipe = new FamilyIconPipe(familiesServiceSpy);
    const family: Family = { icon: 'icon url' } as Family;
    expect(pipe.transform(family)).toBe('familyIcon');
    expect(familiesServiceSpy.getFamilyIcon).toHaveBeenCalledTimes(1);
    expect(familiesServiceSpy.getFamilyIcon).toHaveBeenCalledWith(family);
  });
});
