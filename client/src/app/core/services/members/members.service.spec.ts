import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { FamilyMember } from '@shared/types';
import { of } from 'rxjs';
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
});
