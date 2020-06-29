import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SupportService } from '@core-client/services/support/support.service';
// tslint:disable-next-line: max-line-length
import { emailValidatorFn } from '../../directives/email-validator/email-validator';

@Component({
  selector: 'shared-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  form: FormGroup;
  serverResponse: { type: string; message: string } = { type: '', message: '' };
  submittingForm = false;

  constructor(private supportService: SupportService) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, emailValidatorFn]),
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]),
      subject: new FormControl('', [
        Validators.required,
        Validators.maxLength(20)
      ])
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
    if (!this.form.valid) {
      this.form.markAsTouched();
      return;
    }
    this.serverResponse.message = '';
    this.submittingForm = true;
    this.supportService.contactSupport(this.form.value).subscribe(
      response => {
        this.submittingForm = false;
        this.serverResponse.type = 'success';
        this.serverResponse.message = response.message;
      },
      error => {
        this.submittingForm = false;
        this.serverResponse.type = 'error';
        this.serverResponse.message = error.error.message
          ? error.error.message
          : error.statusText;
      }
    );
  }
}
