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
import {
  Member,
  MembersService
} from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { emailValidatorFn } from '@shared-client/directives/email-validator/email-validator';
import { MemberRole } from '@src/app/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'member-new-family-member-form',
  templateUrl: './new-family-member-form.component.html',
  styleUrls: ['./new-family-member-form.component.scss']
})
export class NewFamilyMemberFormComponent implements OnInit {
  memberForm: FormGroup;
  roles: MemberRole[];
  isLoaded: Observable<boolean>;
  errorMessage: string;

  @ViewChild('emailField') emailField: ElementRef;

  private selectedRoles: { [name: string]: boolean } = {};

  constructor(
    public dialogRef: MatDialogRef<NewFamilyMemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { familyId: string; member: Member },
    private notificationsService: NotificationsService,
    private membersService: MembersService
  ) {}

  ngOnInit() {
    this.isLoaded = this.membersService.getRoles(this.data.familyId).pipe(
      map((roles: MemberRole[]) => {
        this.memberForm = new FormGroup({
          email: new FormControl(
            this.data.member ? this.data.member.email : '',
            [Validators.required, emailValidatorFn]
          ),
          roles: new FormControl(
            this.data.member ? this.data.member.roles : '',
            [Validators.required]
          )
        });
        this.roles = roles;
        return true;
      })
    );
  }

  onRoleChanged(role: MemberRole, change: boolean) {
    this.selectedRoles[role.name] = change;
    Promise.resolve(true).then(() => {
      this.memberForm
        .get('roles')
        .setValue(
          Object.keys(this.selectedRoles).filter(
            (roleName: string) => this.selectedRoles[roleName]
          )
        );
      this.memberForm.updateValueAndValidity();
    });
  }

  submitForm() {
    if (!this.memberForm.valid) {
      this.memberForm.markAsTouched();
      return;
    }
    this.membersService
      .addFamilyMember(this.data.familyId, this.memberForm.value)
      .subscribe(
        () => {
          this.notificationsService.showNotification(
            'New member has been added'
          );
          this.dialogRef.close();
        },
        (error: HttpErrorResponse) => {
          if (error.error.email) {
            this.memberForm
              .get('email')
              .setErrors({ 'server-error': error.error.email });
            this.emailField.nativeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
          if (error.error.message) {
            this.errorMessage = error.error.message;
          }
          this.memberForm.updateValueAndValidity();
          this.memberForm.markAsTouched();
        }
      );
  }
}
