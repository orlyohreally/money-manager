import { cold, initTestScheduler } from 'jasmine-marbles';

// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
import { User } from '@shared/types';

const mockedUser: User = {
  _id: 'userId-1',
  firstName: 'firstName-1',
  lastName: 'lastName-1',
  email: 'email-1',
  icon: 'icon-1',
  currency: 'USD',
  createdAt: new Date('2020-01-02'),
  updatedAt: new Date('2020-01-02')
};

function getUserManagerSpy() {
  initTestScheduler();

  // tslint:disable-next-line: max-line-length
  const userManagerServiceSpy: jasmine.SpyObj<UserManagerService> = jasmine.createSpyObj(
    'UserManager',
    ['loadUser', 'getFullName', 'updateUser']
  );
  userManagerServiceSpy.loadUser.and.returnValue(
    cold('--a', { a: mockedUser })
  );

  userManagerServiceSpy.getFullName.and.returnValue(
    cold('3ms a', { a: `${mockedUser.lastName} ${mockedUser.firstName}` })
  );

  userManagerServiceSpy.updateUser.and.returnValue(
    cold('2ms a', { a: undefined })
  );

  return userManagerServiceSpy;
}
export interface IUserManagerServiceMock {
  service: jasmine.SpyObj<UserManagerService>;
  user: User;
}

export const UserManagerServiceMock: () => IUserManagerServiceMock = () => ({
  service: getUserManagerSpy(),
  user: mockedUser
});
