// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import { User } from '@shared/types';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

const user: User = {
  _id: 'userId-1',
  firstName: 'firstName-1',
  lastName: 'lastName-1',
  email: 'user-email@gmail.com',
  icon: 'userIcon-1.png',
  currency: 'USD',
  createdAt: new Date('2020-01-02'),
  updatedAt: new Date('2020-02-03'),
  colorScheme: 'light',
  isVerified: true
};

function getAuthenticationServiceSpy() {
  // tslint:disable-next-line: max-line-length
  const authenticationServiceSpy: jasmine.SpyObj<AuthenticationService> = jasmine.createSpyObj(
    'AuthenticationService',
    ['getUser', 'isAuthenticated', 'tokenLoadedFromStorage']
  );
  authenticationServiceSpy.getUser.and.returnValue(of(user));
  authenticationServiceSpy.isAuthenticated.and.returnValue(
    cold('--a', { a: true })
  );
  authenticationServiceSpy.tokenLoadedFromStorage.and.returnValue(
    cold('--a', { a: undefined })
  );

  return authenticationServiceSpy;
}

export interface IAuthenticationServiceMock {
  getService: () => jasmine.SpyObj<AuthenticationService>;
  user: User;
}

// tslint:disable-next-line: max-line-length
export const AuthenticationServiceMock: () => IAuthenticationServiceMock = () => ({
  getService: getAuthenticationServiceSpy,
  user
});
