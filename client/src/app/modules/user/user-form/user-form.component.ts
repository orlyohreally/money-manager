import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// tslint:disable-next-line: max-line-length
import { FormComponent } from '@shared-client/components/form/form.component';
// tslint:disable-next-line: max-line-length
import { emailValidatorFn } from '@shared-client/directives/email-validator/email-validator';
import { User } from '@shared/types';
import { nameValidatorFn } from '@shared/utils';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent extends FormComponent<User>
  implements OnInit, OnChanges {
  @Input() user: User;
  @Input() errorMessage: string;
  @Input() submittingForm: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl(this.user.firstName, [
        Validators.required,
        control => nameValidatorFn(control.value)
      ]),
      lastName: new FormControl(this.user.lastName, [
        Validators.required,
        control => nameValidatorFn(control.value)
      ]),
      email: new FormControl({ value: this.user.email, disabled: true }, [
        Validators.required,
        emailValidatorFn
      ]),
      icon: new FormControl(this.user.icon),
      currency: new FormControl(this.user.currency, Validators.required)
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form && changes.user) {
      const user: User = changes['user'].currentValue as User;
      const updatedFormValue = (({
        firstName,
        lastName,
        email,
        icon,
        currency
      }) => ({
        firstName,
        lastName,
        email,
        icon,
        currency
      }))(user);
      this.form.setValue(updatedFormValue);
    }
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get email() {
    return this.form.get('email');
  }

  get currency() {
    return this.form.get('currency');
  }

  onCurrencySelected(selectedCurrency: string) {
    this.form.get('currency').setValue(selectedCurrency);
  }

  familyIconLoaded(userIcon: string) {
    this.form.get('icon').setValue(userIcon);
  }

  submitForm() {
    if (!this.form.valid) {
      this.form.markAsTouched();
      return;
    }
    this.formSubmitted.emit({
      ...this.form.value,
      email: this.user.email,
      _id: this.user._id
    });
  }
}
