import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import {
  Member,
  MembersService
} from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { emailValidatorFn } from '@shared-client/directives/email-validator/email-validator';
import { FamilyMember } from '@shared/types';
import { MemberFamily } from '@src/app/modules/shared/types';
import { AdultMember } from '@src/app/types/adult-member';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'member-new-member-form',
  templateUrl: './new-member-form.component.html',
  styleUrls: ['./new-member-form.component.scss']
})
export class NewFamilyMemberFormComponent implements OnInit {
  memberForm: FormGroup;
  rolesLoaded: boolean;
  errorMessage: string;

  @ViewChild('emailField') emailField: ElementRef;

  private membersPaymentPercentagesInfo: {
    value: AdultMember[];
    valid: boolean;
  };

  constructor(
    public dialogRef: MatDialogRef<NewFamilyMemberFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { family: MemberFamily; member: Member },
    private notificationsService: NotificationsService,
    private membersService: MembersService,
    private familiesService: FamiliesService
  ) {}

  ngOnInit() {
    this.memberForm = new FormGroup({
      email: new FormControl(this.data.member ? this.data.member.email : '', [
        Validators.required,
        emailValidatorFn
      ]),
      roles: new FormControl(this.data.member ? this.data.member.roles : '', [
        Validators.required
      ])
    });
  }

  onRoleChanged(roles: string[]) {
    Promise.resolve(true).then(() => {
      this.memberForm.get('roles').setValue(roles);
      this.memberForm.updateValueAndValidity();
    });
  }

  onRolesLoad() {
    this.rolesLoaded = true;
  }

  onPercentagesSet(percentagesInfo: { value: AdultMember[]; valid: boolean }) {
    this.membersPaymentPercentagesInfo = percentagesInfo;
  }

  submitForm() {
    if (!this.memberForm.valid) {
      this.memberForm.markAsTouched();
      return;
    }
    this.membersService
      .addFamilyMember(this.data.family._id, this.memberForm.value)
      .pipe(
        mergeMap((newMember: FamilyMember) => {
          if (
            !this.data.family.equalPayments &&
            this.membersService.memberIsAdult(newMember.roles)
          ) {
            return this.updatePercentages(newMember);
          }
          return of(undefined);
        })
      )
      .subscribe(
        () => {
          this.notificationsService.showNotification(
            'New member has been added'
          );
          this.dialogRef.close();
        },
        (error: HttpErrorResponse) => {
          if (error.error && error.error.email) {
            this.memberForm
              .get('email')
              .setErrors({ 'server-error': error.error.email });
            this.emailField.nativeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          } else if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Server Error';
          }
          this.memberForm.updateValueAndValidity();
          this.memberForm.markAsTouched();
        }
      );
  }

  private updatePercentages(newMember: FamilyMember): Observable<void> {
    const percentages = this.membersPaymentPercentagesInfo.value.map(adult => {
      return {
        userId: adult.userId ? adult.userId : newMember._id,
        paymentPercentage: adult.paymentPercentage
      };
    });
    return this.familiesService.updateMembersPaymentPercentages(
      this.data.family._id,
      percentages
    );
  }
}
