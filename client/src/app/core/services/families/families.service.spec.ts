import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { first, switchMap } from 'rxjs/operators';

import { FamilyView } from '@shared/types';
import { FamiliesServiceMock } from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { FamiliesService } from './families.service';

describe('FamiliesService', () => {
  let service: FamiliesService;
  let httpTestingController: HttpTestingController;

  const familiesServiceMock = FamiliesServiceMock();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: GlobalVariablesService, useValue: { apiURL: 'apiURL' } }
      ]
    });
    service = TestBed.get(FamiliesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loadFamilies should make GET http request' + ' to api/families/', () => {
    service.loadFamilies().subscribe(families => {
      expect(families).toEqual(familiesServiceMock.memberFamilies);
    });

    const req = httpTestingController.expectOne({
      url: 'apiURL/families/',
      method: 'GET'
    });

    req.flush(familiesServiceMock.memberFamilies);
  });

  it(
    'updateMemberFamilySpentAmount should increase how much member' +
      ' has spent for set family',
    () => {
      const mockedAmount = 400;
      service
        .loadFamilies()
        .pipe(
          switchMap(() => {
            service.updateMemberFamilySpentAmount(
              familiesServiceMock.memberFamilies[0]._id,
              mockedAmount,
              '+'
            );
            return service.familiesInfo;
          })
        )
        .subscribe(
          (families: { families: FamilyView[]; currentFamily: FamilyView }) => {
            const updatedFamily: FamilyView = {
              ...familiesServiceMock.memberFamilies[0],
              spent: familiesServiceMock.memberFamilies[0].spent + mockedAmount
            };
            expect(families).toEqual({
              families: [
                updatedFamily,
                { ...familiesServiceMock.memberFamilies[1] }
              ],
              currentFamily: updatedFamily
            });
          }
        );

      const req = httpTestingController.expectOne({
        url: 'apiURL/families/',
        method: 'GET'
      });

      req.flush(familiesServiceMock.memberFamilies.slice(0, 2));
    }
  );

  it(
    'updateMemberFamilySpentAmount should increase how much member' +
      ' has spent for set family when exchange rate is set for currency change',
    () => {
      const mockedExchangeRate = 2;
      service
        .loadFamilies()
        .pipe(
          switchMap(() => {
            service.updateMemberFamilySpentAmount(
              familiesServiceMock.memberFamilies[0]._id,
              mockedExchangeRate,
              '*'
            );
            return service.familiesInfo;
          })
        )
        .subscribe(
          (families: { families: FamilyView[]; currentFamily: FamilyView }) => {
            const updatedFamily: FamilyView = {
              ...familiesServiceMock.memberFamilies[0],
              spent:
                familiesServiceMock.memberFamilies[0].spent * mockedExchangeRate
            };
            expect(families).toEqual({
              families: [
                updatedFamily,
                { ...familiesServiceMock.memberFamilies[1] }
              ],
              currentFamily: updatedFamily
            });
          }
        );

      const req = httpTestingController.expectOne({
        url: 'apiURL/families/',
        method: 'GET'
      });

      req.flush(familiesServiceMock.memberFamilies.slice(0, 2));
    }
  );

  it('getFamilyById should return family with set id', () => {
    const searchedFamily = familiesServiceMock.memberFamilies[1];
    const familyId = searchedFamily._id;
    service.getFamilyById(familyId).subscribe(family => {
      expect(family).toEqual(searchedFamily);
    });

    const req = httpTestingController.expectOne({
      url: 'apiURL/families/',
      method: 'GET'
    });

    req.flush(familiesServiceMock.memberFamilies);
  });

  it('familiesInfo should load families and return families info', () => {
    service.familiesInfo.pipe(first()).subscribe(familiesInfo => {
      expect(familiesInfo).toEqual({
        families: familiesServiceMock.memberFamilies,
        currentFamily: familiesServiceMock.memberFamilies[0]
      });
    });

    const req = httpTestingController.expectOne({
      url: 'apiURL/families/',
      method: 'GET'
    });

    req.flush(familiesServiceMock.memberFamilies);
  });

  it('setCurrentFamily should update current family', () => {
    const newCurrentFamily = familiesServiceMock.memberFamilies[1];
    service
      .loadFamilies()
      .pipe(
        switchMap(() => {
          service.setCurrentFamily(newCurrentFamily._id);
          return service.familiesInfo.pipe(first());
        })
      )
      .subscribe(familiesInfo => {
        expect(familiesInfo).toEqual({
          families: familiesServiceMock.memberFamilies,
          currentFamily: newCurrentFamily
        });
      });

    const req = httpTestingController.expectOne({
      url: 'apiURL/families/',
      method: 'GET'
    });

    req.flush(familiesServiceMock.memberFamilies);
  });

  it('updateFamilyMemberCount should set member count for set family', () => {
    const newMembersCount = 4;

    const updatedFamily = familiesServiceMock.memberFamilies[1];
    service
      .loadFamilies()
      .pipe(
        switchMap(() => {
          service.updateFamilyMemberCount(updatedFamily._id, newMembersCount);
          return service.familiesInfo.pipe(first());
        })
      )
      .subscribe(familiesInfo => {
        expect(familiesInfo).toEqual({
          families: [
            familiesServiceMock.memberFamilies[0],
            { ...updatedFamily, membersCount: newMembersCount }
          ],
          currentFamily: familiesServiceMock.memberFamilies[0]
        });
      });

    const req = httpTestingController.expectOne({
      url: 'apiURL/families/',
      method: 'GET'
    });

    req.flush(familiesServiceMock.memberFamilies.slice(0, 2));
  });
});
