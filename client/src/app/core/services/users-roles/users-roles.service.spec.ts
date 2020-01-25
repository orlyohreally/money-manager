import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { MemberRole } from '@src/app/types';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { UsersRolesService } from './users-roles.service';

describe('UserRoleService', () => {
  let service: UsersRolesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: GlobalVariablesService, useValue: { apiURL: 'apiURL' } }
      ]
    });
    service = TestBed.get(UsersRolesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getRoles should return Observable of response from api/roles', () => {
    const mockedResponse: MemberRole[] = [
      { name: 'Admin', description: 'Can do everything', default: false },
      { name: 'Member', description: 'Can do something', default: true }
    ];

    service.getRoles().subscribe((roles: MemberRole[]) => {
      expect(roles).toBe(mockedResponse);
    });

    const req = httpTestingController.expectOne('apiURL/roles');
    req.flush(mockedResponse);
    httpTestingController.verify();
  });
});
