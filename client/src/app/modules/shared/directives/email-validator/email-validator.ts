import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export function emailValidatorFn(
  control: AbstractControl
): ValidationErrors | null {
  return Validators.pattern(
    '(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$)'
  );
}
