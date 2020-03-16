// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { Family } from '@shared/types';
import { cold } from 'jasmine-marbles';

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

function getFamiliesServiceSpy() {
  // tslint:disable-next-line: max-line-length
  const familiesServiceSpy: jasmine.SpyObj<FamiliesService> = jasmine.createSpyObj(
    'FamiliesService',
    ['getFamilyById', 'getFamiliesList', 'getFamilyCurrency']
  );
  familiesServiceSpy.getFamilyById.and.returnValue(cold('--a', { a: family }));

  familiesServiceSpy.getFamiliesList.and.returnValue(
    cold('--a', { a: familyList })
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
}

export const FamiliesServiceMock: () => IFamiliesServiceMock = () => ({
  service: getFamiliesServiceSpy(),
  familyList,
  family
});
