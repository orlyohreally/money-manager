import { AbstractControl, ValidationErrors } from '@angular/forms';

export function userNameValidatorFn(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  // tslint:disable-next-line: max-line-length
  const pattern = /^[a-zA-Z\s-]*$/;
  const invalidPattern = !new RegExp(pattern).test(control.value);
  const tooLong = control.value.length > 15;
  const tooShort = control.value.length < 3;
  return invalidPattern || tooLong || tooShort
    ? {
        username: true,
        ...(invalidPattern && { pattern: true }),
        ...(tooShort && { minlength: true }),
        ...(tooLong && { maxlength: true })
      }
    : null;
}
