import { cold, initTestScheduler } from 'jasmine-marbles';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { Family, FamilyView, Roles } from '@shared/types';
import { findById } from '@src/app/modules/shared/functions';

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

const memberFamilies: FamilyView[] = [
  {
    _id: 'familyId-1',
    name: 'familyName-1',
    icon: 'familyIcon-1.png',
    currency: 'USD',
    equalPayments: true,
    createdAt: new Date('2020-01-02'),
    updatedAt: new Date('2020-02-03'),
    userRoles: [Roles.Owner, Roles.Member],
    membersCount: 3,
    spent: 100
  },
  {
    _id: 'familyId-2',
    name: 'familyName-2',
    icon: 'familyIcon-2.png',
    currency: 'USD',
    equalPayments: false,
    createdAt: new Date('2020-01-04'),
    updatedAt: new Date('2020-01-06'),
    userRoles: [Roles.Member],
    membersCount: 3,
    spent: 250
  }
];

function getFamiliesServiceSpy() {
  initTestScheduler();

  const familiesServiceSpy: jasmine.SpyObj<FamiliesService> = {
    ...jasmine.createSpyObj('FamiliesService', [
      'getFamilyById',
      'getFamiliesList',
      'getFamilyCurrency',
      'loadFamilies',
      'setCurrentFamily'
    ])
  };
  Object.defineProperty(familiesServiceSpy, 'familiesInfo', {
    get() {
      return cold('--a', {
        a: { families: memberFamilies, currentFamily: memberFamilies[0] }
      });
    },
    enumerable: true,
    configurable: true
  });

  familiesServiceSpy.getFamilyById.and.callFake((familyId: string) =>
    cold('--a', { a: findById(memberFamilies, familyId) })
  );

  familiesServiceSpy.getFamiliesList.and.returnValue(
    cold('--a', { a: memberFamilies })
  );

  familiesServiceSpy.getFamilyCurrency.and.callFake((familyId: string) => {
    return cold('--a', { a: familyId === 'familyId-1' ? 'USD' : 'ILS' });
  });

  return familiesServiceSpy;
}

export interface IFamiliesServiceMock {
  service: jasmine.SpyObj<FamiliesService>;
  familyList: Family[];
  family: Family;
  memberFamilies: FamilyView[];
}

export const FamiliesServiceMock: () => IFamiliesServiceMock = () => ({
  service: getFamiliesServiceSpy(),
  familyList,
  family,
  memberFamilies
});
