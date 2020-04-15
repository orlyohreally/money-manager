import { FormControl } from '@angular/forms';

import { userNameValidatorFn } from './user-name-validator';

describe('userNameValidatorFn', () => {
  it('should create an instance', () => {
    expect(userNameValidatorFn).toBeTruthy();
  });

  it(
    'should return username and minlength error' +
      ' for too short user name (less than 3 characters)',
    () => {
      const dummyControl = new FormControl('ab');
      expect(userNameValidatorFn(dummyControl)).toEqual(
        jasmine.objectContaining({
          username: true,
          minlength: true
        })
      );
    }
  );

  it(
    'should return username and maxlength error' +
      ' for too long user name (more than 15 characters)',
    () => {
      const dummyControl = new FormControl('a'.repeat(16));
      expect(userNameValidatorFn(dummyControl)).toEqual({
        username: true,
        maxlength: true
      });
    }
  );

  it('should not return username error for validName', () => {
    const dummyControl = new FormControl('validName');
    expect(userNameValidatorFn(dummyControl)).toBeFalsy();
  });

  it('should return username error and pattern for 1invalidName', () => {
    const dummyControl = new FormControl('1invalidName');
    expect(userNameValidatorFn(dummyControl)).toEqual({
      username: true,
      pattern: true
    });
  });

  it('should not return username error for empty name', () => {
    const dummyControl = new FormControl('');
    expect(userNameValidatorFn(dummyControl)).toBeFalsy();
  });
});
