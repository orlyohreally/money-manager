// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import { User } from '@shared/types';
import { cold } from 'jasmine-marbles';

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
    ['getUser']
  );
  authenticationServiceSpy.getUser.and.returnValue(cold('--a', { a: user }));

  return authenticationServiceSpy;
}

export interface IAuthenticationServiceMock {
  service: jasmine.SpyObj<AuthenticationService>;
  user: User;
}

// tslint:disable-next-line: max-line-length
export const AuthenticationServiceMock: () => IAuthenticationServiceMock = () => ({
  service: getAuthenticationServiceSpy(),
  user
});
