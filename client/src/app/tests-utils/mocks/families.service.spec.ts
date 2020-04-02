import { MemberFamily } from '@shared-client/types';
import { cold } from 'jasmine-marbles';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { Family, Roles } from '@shared/types';

const family: Family = {
  _id: 'familyId-1',
  name: 'familyName-1',
  icon: 'familyIcon-1.png',
  currency: 'USD',
  equalPayments: true,
  createdAt: new Date('2020-01-02'),
  updatedAt: new Date('2020-02-03')
};

const familyList: Family[] = [
  {
    _id: 'familyId-1',
    name: 'familyName-1',
    icon: 'familyIcon-1.png',
    currency: 'USD',
    equalPayments: true,
    createdAt: new Date('2020-01-02'),
    updatedAt: new Date('2020-02-03')
  },
  {
    _id: 'familyId-2',
    name: 'familyName-2',
    icon: 'familyIcon-2.png',
    currency: 'USD',
    equalPayments: false,
    createdAt: new Date('2020-01-04'),
    updatedAt: new Date('2020-01-06')
  }
];

const memberFamilies: MemberFamily[] = [
  {
    _id: 'familyId-1',
    name: 'familyName-1',
    icon: 'familyIcon-1.png',
    currency: 'USD',
    equalPayments: true,
    createdAt: new Date('2020-01-02'),
    updatedAt: new Date('2020-02-03'),
    roles: [Roles.Owner, Roles.Member]
  },
  {
    _id: 'familyId-2',
    name: 'familyName-2',
    icon: 'familyIcon-2.png',
    currency: 'USD',
    equalPayments: false,
    createdAt: new Date('2020-01-04'),
    updatedAt: new Date('2020-01-06'),
    roles: [Roles.Member]
  }
];

function getFamiliesServiceSpy() {
  const familiesServiceSpy: jasmine.SpyObj<FamiliesService> = {
    ...jasmine.createSpyObj('FamiliesService', [
      'getFamilyById',
      'getFamiliesList',
      'getFamilyCurrency',
      'loadFamilies',
      'setCurrentFamily'
    ]),
    familiesInfo: cold('--a', {
      a: { families: familyList, currentFamily: family }
    })
  };

  familiesServiceSpy.getFamilyById.and.returnValue(cold('--a', { a: family }));

  familiesServiceSpy.getFamiliesList.and.returnValue(
    cold('--a', { a: familyList })
  );

  familiesServiceSpy.getFamilyCurrency.and.callFake((familyId: string) => {
    return cold('--a', { a: familyId === 'familyId-1' ? 'USD' : 'ILS' });
  });

  familiesServiceSpy.loadFamilies.and.returnValue(
    cold('---a', { a: memberFamilies })
  );

  return familiesServiceSpy;
}

export interface IFamiliesServiceMock {
  service: jasmine.SpyObj<FamiliesService>;
  familyList: Family[];
  family: Family;
  memberFamilies: MemberFamily[];
}

export const FamiliesServiceMock: () => IFamiliesServiceMock = () => ({
  service: getFamiliesServiceSpy(),
  familyList,
  family,
  memberFamilies
});
