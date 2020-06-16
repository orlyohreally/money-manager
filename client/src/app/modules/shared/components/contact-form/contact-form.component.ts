import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// tslint:disable-next-line: max-line-length
import { emailValidatorFn } from '../../directives/email-validator/email-validator';

@Component({
  selector: 'shared-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  form: FormGroup;
  errorMessage: string;
  submittingForm = false;

  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, emailValidatorFn]),
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]),
      subject: new FormControl('', Validators.required)
    });
  }

  get email() {
    return this.form.get('email');
  }

  get message() {
    return this.form.get('message');
  }

  get subject() {
    return this.form.get('subject');
  }

  submitForm() {
    console.log(this.form.valid, this.form.value);
    this.submittingForm = true;
  }
}
