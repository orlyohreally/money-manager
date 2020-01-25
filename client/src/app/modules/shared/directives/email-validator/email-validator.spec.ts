import { FormControl } from '@angular/forms';
import { emailValidatorFn } from './email-validator';

describe('emailValidatorFnDirective', () => {
  it('should create an instance', () => {
    expect(emailValidatorFn).toBeTruthy();
  });

  it('validate should return false for invalidEmail.com)', () => {
    const dummyControl = new FormControl('invalidEmail.com');
    expect(emailValidatorFn(dummyControl).email).toBeFalsy();
  });

  it('validate should return false for invalid@Emailcom)', () => {
    const dummyControl = new FormControl('invalid@Emailcom');
    expect(emailValidatorFn(dummyControl).email).toBeFalsy();
  });

  it('validate should return false for invalidEmailcom)', () => {
    const dummyControl = new FormControl('invalidEmailcom)');
    expect(emailValidatorFn(dummyControl).email).toBeFalsy();
  });

  it('validate should return true for validEmail@gmail.com', () => {
    const dummyControl = new FormControl('validEmail@gmail.com)');
    expect(emailValidatorFn(dummyControl).email).toBeFalsy();
  });
});
