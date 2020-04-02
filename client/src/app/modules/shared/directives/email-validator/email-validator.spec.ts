import { FormControl } from '@angular/forms';

import { emailValidatorFn } from './email-validator';

describe('emailValidatorFn', () => {
  it('should create an instance', () => {
    expect(emailValidatorFn).toBeTruthy();
  });

  it('validate should return email error for invalidEmail.com)', () => {
    const dummyControl = new FormControl('invalidEmail.com');
    expect(emailValidatorFn(dummyControl).email).toBeTruthy();
  });

  it('validate should return email error for invalid@Emailcom)', () => {
    const dummyControl = new FormControl('invalid@Emailcom');
    expect(emailValidatorFn(dummyControl).email).toBeTruthy();
  });

  it('validate should return email error for invalidEmailcom)', () => {
    const dummyControl = new FormControl('invalidEmailcom)');
    expect(emailValidatorFn(dummyControl).email).toBeTruthy();
  });

  it('validate should not return email error for validEmail@gmail.com', () => {
    const dummyControl = new FormControl('validEmail@gmail.com');
    expect(emailValidatorFn(dummyControl)).toBeFalsy();
  });
});
