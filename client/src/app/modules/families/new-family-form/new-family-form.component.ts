import { Component, Input, isDevMode, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { FamiliesService, NotificationsService } from '@core-client/services';
// tslint:disable-next-line: max-line-length
import { userNameValidatorFn } from '@shared-client/directives/user-name-validator/user-name-validator';
import { MemberFamily } from '@shared-client/types';
import { FamilyView } from '@shared/types';

@Component({
  selector: 'family-new-family-form',
  templateUrl: './new-family-form.component.html',
  styleUrls: ['./new-family-form.component.scss']
})
export class NewFamilyFormComponent implements OnInit {
  @Input() form: FormGroup;

  memberRoles: string[] = [];
  submittingForm = false;
  errorMessage: string;

  constructor(
    private dialogRef: MatDialogRef<NewFamilyFormComponent>,
    private familiesService: FamiliesService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, userNameValidatorFn]),
      icon: new FormControl(''),
      currency: new FormControl('', [Validators.required]),
      equalPayments: new FormControl(true)
    });
  }

  submitForm() {
    if (!this.form.valid || !this.memberRoles.length) {
      this.form.markAsTouched();
      return;
    }
    this.createFamily(this.form.value);
  }

  onRolesUpdated(roles: string[]) {
    this.memberRoles = roles;
  }

  private createFamily(family: MemberFamily) {
    this.submittingForm = true;
    this.familiesService.createFamily(family, this.memberRoles).subscribe(
      (response: FamilyView) => {
        this.submittingForm = false;

        this.dialogRef.close();
        this.notificationsService.showNotification(
          'Family has been successfully created'
        );
        this.router.navigate([`/families/${response._id}/dashboard`]);
      },
      error => {
        if (isDevMode()) {
          // tslint:disable-next-line: no-console
          console.log('error', error);
        }
        this.errorMessage =
          error.message && error.error.message
            ? error.error.message
            : 'Server Error';
        this.submittingForm = false;
        this.notificationsService.showNotification('Server Error');
      }
    );
  }
}
