import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { forkJoin } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

import { FamilyMember, MemberPaymentPercentage } from '@shared/types';
import {
  AuthenticationServiceMock,
  MembersServiceMock
} from '@src/app/tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { MembersService } from './members.service';

describe('MembersService', () => {
  let service: MembersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: GlobalVariablesService, useValue: { apiURL: 'apiURL' } }
      ]
    });
    service = TestBed.get(MembersService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(
    'getMembers should make GET request' + ' to api/families/:familyId/members',
    done => {
      const mockedMembers: FamilyMember[] = [
        {
          firstName: 'Adam',
          roles: ['Admin']
        } as FamilyMember
      ];
      service.getMembers('familyId').subscribe((response: FamilyMember[]) => {
        expect(response).toBe(mockedMembers);
        done();
      });

      const req = httpTestingController.expectOne(
        'apiURL/families/familyId/members'
      );
      req.flush(mockedMembers);
    }
  );

  it(
    'addFamilyMember should make POST request' +
      ' to api/families/:familyId/members',
    done => {
      const mockedMembers: FamilyMember[] = [
        {
          email: 'email@gmail.com',
          roles: ['Admin']
        } as FamilyMember
      ];

      const mockedFamilyMember: FamilyMember = {
        email: 'email@gmail.com',
        roles: ['Admin']
      } as FamilyMember;
      const mockedResponse: FamilyMember = {
        roles: ['Member']
      } as FamilyMember;

      service
        .addFamilyMember('familyId', mockedFamilyMember)
        .subscribe((response: FamilyMember) => {
          expect(response).toBe(mockedResponse);
          done();
        });

      const req = httpTestingController.expectOne({
        url: 'apiURL/families/familyId/members',
        method: 'POST'
      });
      req.flush(mockedResponse);

      const reqGet = httpTestingController.expectOne({
        url: 'apiURL/families/familyId/members',
        method: 'GET'
      });
      reqGet.flush(mockedMembers);
    }
  );

  it('updateMember should update member info for every family', done => {
    const family1Members: FamilyMember[] = [
      {
        _id: 'userId-1',
        firstName: 'firstName-1',
        lastName: 'lastName-1',
        email: 'email-1@gmail.com',
        roles: ['Owner', 'Admin'],
        icon: 'icon-1.png',
        paymentPercentage: 10,
        inactive: false,
        createdAt: new Date('2020-01-02'),
        updatedAt: new Date('2020-02-03')
      },
      {
        _id: 'userId-2',
        firstName: 'firstName-2',
        lastName: 'lastName-2',
        email: 'email-2@gmail.com',
        roles: ['Member'],
        icon: 'icon-2.png',
        paymentPercentage: 90,
        inactive: false,
        createdAt: new Date('2020-01-02'),
        updatedAt: new Date('2020-02-03')
      }
    ];
    const family2Members: FamilyMember[] = [
      {
        _id: 'userId-3',
        firstName: 'firstName-3',
        lastName: 'lastName-3',
        email: 'email-3@gmail.com',
        roles: ['Member'],
        icon: 'icon-3.png',
        paymentPercentage: 90,
        inactive: false,
        createdAt: new Date('2020-01-12'),
        updatedAt: new Date('2020-02-03')
      },
      {
        _id: 'userId-1',
        firstName: 'firstName-1',
        lastName: 'lastName-1',
        email: 'email-1@gmail.com',
        roles: ['Owner', 'Admin'],
        icon: 'icon-1.png',
        paymentPercentage: 10,
        inactive: false,
        createdAt: new Date('2020-01-02'),
        updatedAt: new Date('2020-02-03')
      }
    ];

    const updatedUser = {
      ...AuthenticationServiceMock().user,
      _id: 'userId-1',
      icon: 'updated-icon.png',
      lastName: 'Samuel'
    } as FamilyMember;

    service
      .getMembers('familyId-1')
      .pipe(
        first(),
        switchMap(() => {
          return service.getMembers('familyId-2').pipe(first());
        }),
        map(() => {
          return service.updateMember('userId-1', updatedUser);
        }),
        switchMap(() => {
          return forkJoin([
            service.getMembers('familyId-1').pipe(first()),
            service.getMembers('familyId-2').pipe(first())
          ]);
        })
      )
      .subscribe(res => {
        expect(res).toEqual([
          [updatedUser, family1Members[1]],
          [family2Members[0], updatedUser]
        ]);
        done();
      });

    const reqFamiliesMembers1 = httpTestingController.expectOne({
      url: 'apiURL/families/familyId-1/members',
      method: 'GET'
    });
    reqFamiliesMembers1.flush(family1Members);
    const reqFamiliesMembers2 = httpTestingController.expectOne({
      url: 'apiURL/families/familyId-2/members',
      method: 'GET'
    });
    reqFamiliesMembers2.flush(family2Members);
  });

  it(
    'updateMembersPaymentPercentages should make put request' +
      ' to families/:familyId/members/payment-percentages' +
      ' and update members percentages' +
      ' if equalPercentages is false',
    done => {
      const familyMembers: FamilyMember[] = MembersServiceMock().membersList;
      const percentages: MemberPaymentPercentage[] = [
        { userId: familyMembers[0]._id, paymentPercentage: 30 },
        { userId: familyMembers[1]._id, paymentPercentage: 70 }
      ];
      const familyId = 'familyId-1';
      service
        .getMembers('familyId-1')
        .pipe(
          first(),
          switchMap(() => {
            return service.updateMembersPaymentPercentages(
              familyId,
              false,
              percentages
            );
          }),
          switchMap(() => {
            return service.getMembers(familyId).pipe(first());
          })
        )
        .subscribe((res: FamilyMember[]) => {
          expect(res).toEqual([
            { ...familyMembers[0], paymentPercentage: 30 },
            { ...familyMembers[1], paymentPercentage: 70 }
          ]);
          done();
        });

      const reqFamiliesMembers = httpTestingController.expectOne({
        url: 'apiURL/families/familyId-1/members',
        method: 'GET'
      });
      reqFamiliesMembers.flush(familyMembers);

      const reqPercentages = httpTestingController.expectOne({
        url: 'apiURL/families/familyId-1/members/payment-percentages',
        method: 'PUT'
      });
      reqPercentages.flush({ message: 'message' });
    }
  );

  it(
    'updateMembersPaymentPercentages should set  members percentages equal' +
      ' if equalPercentages is true',
    done => {
      const familyMembers: FamilyMember[] = MembersServiceMock().membersList;
      const familyId = 'familyId-1';
      service
        .getMembers('familyId-1')
        .pipe(
          first(),
          switchMap(() => {
            return service.updateMembersPaymentPercentages(familyId, true);
          }),
          switchMap(() => {
            return service.getMembers(familyId).pipe(first());
          })
        )
        .subscribe((res: FamilyMember[]) => {
          expect(res).toEqual([
            { ...familyMembers[0], paymentPercentage: 50 },
            { ...familyMembers[1], paymentPercentage: 50 }
          ]);
          done();
        });

      const reqFamiliesMembers = httpTestingController.expectOne({
        url: 'apiURL/families/familyId-1/members',
        method: 'GET'
      });
      reqFamiliesMembers.flush(familyMembers);
    }
  );
});
