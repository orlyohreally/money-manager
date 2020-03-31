import { MembersService } from '@core-client/services/members/members.service';
import { FamilyMember } from '@shared/types';
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

function getMembersServiceSpy() {
  initTestScheduler();

  // tslint:disable-next-line: max-line-length
  const familiesServiceSpy: jasmine.SpyObj<MembersService> = jasmine.createSpyObj(
    'MembersService',
    ['getFamilyMemberById', 'getMembers']
  );
  familiesServiceSpy.getFamilyMemberById.and.returnValue(
    cold('--a', { a: mockedFamilyMember })
  );

  familiesServiceSpy.getMembers.and.returnValue(
    cold('3ms a', { a: mockedFamilyMembersList })
  );
  return familiesServiceSpy;
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
