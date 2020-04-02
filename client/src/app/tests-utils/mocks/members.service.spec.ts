import { MembersService } from '@core-client/services/members/members.service';
import { FamilyMember, Roles } from '@shared/types';
import { cold, initTestScheduler } from 'jasmine-marbles';

const mockedFamilyMember: FamilyMember = {
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
};

const mockedFamilyMembersList: FamilyMember[] = [
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

const roles = [
  {
    name: Roles.Member,
    description: 'Member role',
    default: false
  },
  {
    name: Roles.Admin,
    description: 'Admin role',
    default: false
  }
];

function getMembersServiceSpy() {
  initTestScheduler();

  // tslint:disable-next-line: max-line-length
  const membersServiceSpy: jasmine.SpyObj<MembersService> = jasmine.createSpyObj(
    'MembersService',
    [
      'getFamilyMemberById',
      'getMembers',
      'getRoles',
      'userIsFamilyAdmin',
      'familyMemberCanManageFamilyPayments'
    ]
  );
  membersServiceSpy.getFamilyMemberById.and.returnValue(
    cold('--a', { a: mockedFamilyMember })
  );

  membersServiceSpy.getMembers.and.returnValue(
    cold('3ms a', { a: mockedFamilyMembersList })
  );

  membersServiceSpy.userIsFamilyAdmin.and.returnValue(cold('-a', { a: true }));

  membersServiceSpy.getRoles.and.returnValue(cold('-a', { a: roles }));

  membersServiceSpy.familyMemberCanManageFamilyPayments.and.returnValue(true);

  return membersServiceSpy;
}
export interface IMembersServiceMock {
  service: jasmine.SpyObj<MembersService>;
  member: FamilyMember;
  membersList: FamilyMember[];
}

export const MembersServiceMock: () => IMembersServiceMock = () => ({
  service: getMembersServiceSpy(),
  member: mockedFamilyMember,
  membersList: mockedFamilyMembersList
});
