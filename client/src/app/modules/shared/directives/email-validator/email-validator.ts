import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emailValidatorFn(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  // tslint:disable-next-line: max-line-length
  const pattern = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return new RegExp(pattern).test(control.value) ? null : { email: true };
}
