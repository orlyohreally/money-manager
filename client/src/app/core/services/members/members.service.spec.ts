import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { forkJoin, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

import { FamilyMember } from '@shared/types';
import { AuthenticationServiceMock } from '@src/app/tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { Member, MembersService } from './members.service';

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(
    'getMembers should make GET request' + ' to api/families/:familyId/members',
    () => {
      const mockedMembers: FamilyMember[] = [
        {
          firstName: 'Adam',
          roles: ['Admin']
        } as FamilyMember
      ];
      service.getMembers('familyId').subscribe((response: FamilyMember[]) => {
        expect(response).toBe(mockedMembers);
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
    () => {
      const mockedMembers: Member[] = [
        {
          email: 'email@gmail.com',
          roles: ['Admin']
        } as Member
      ];
      spyOn(service, 'getMembers').and.returnValue(of(mockedMembers));

      const mockedFamilyMember: Partial<Member> = {
        email: 'email@gmail.com',
        roles: ['Admin']
      };
      const mockedResponse: FamilyMember = {
        roles: ['Member']
      } as FamilyMember;

      service
        .addFamilyMember('familyId', mockedFamilyMember)
        .subscribe((response: FamilyMember) => {
          expect(response).toBe(mockedResponse);
          expect(service.getMembers).toHaveBeenCalledTimes(1);
          expect(service.getMembers).toHaveBeenCalledWith('familyId');
        });

      const req = httpTestingController.expectOne(
        'apiURL/families/familyId/members'
      );
      req.flush(mockedResponse);
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
});
