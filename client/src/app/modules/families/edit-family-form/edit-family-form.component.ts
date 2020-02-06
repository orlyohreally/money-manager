import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
import { Family } from '@shared/types';
import { AdultMember } from '@src/app/types/adult-member';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { FormComponent } from '../../shared/components/form/form.component';
import { MemberFamily } from '../../shared/types';

@Component({
  selector: 'family-edit-family-form',
  templateUrl: './edit-family-form.component.html',
  styleUrls: ['./edit-family-form.component.scss']
})
export class EditFamilyFormComponent
  extends FormComponent<EditFamilyFormComponent>
  implements OnInit {
  @Input() form: FormGroup;

  errorMessage: string;

  private membersPaymentPercentagesInfo: {
    value: AdultMember[];
    valid: boolean;
  };

  constructor(
    dialogRef: MatDialogRef<EditFamilyFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public family: Family,
    private familiesService: FamiliesService,
    private notificationsService: NotificationsService
  ) {
    super(dialogRef);
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.family ? this.family.name : '', [
        Validators.required
      ]),
      icon: new FormControl(this.family ? this.family.icon : ''),
      currency: new FormControl(
        this.family ? this.family.currency : '',
        Validators.required
      ),
      equalPayments: new FormControl(
        this.family ? this.family.equalPayments : true
      )
    });
  }

  submitForm() {
    this.errorMessage = null;
    const invalidPercentage =
      !this.membersPaymentPercentagesInfo ||
      !this.membersPaymentPercentagesInfo.valid;
    if (
      !this.form.valid ||
      (!this.form.get('equalPayments').value && invalidPercentage)
    ) {
      this.form.markAsTouched();
      return;
    }

    this.updateFamily({
      ...this.form.value,
      _id: this.family._id
    })
      .pipe(
        concatMap(() => {
          if (this.form.value.equalPayments) {
            return of(undefined);
          }
          return this.updatePercentages();
        })
      )
      .subscribe(
        () => {
          this.dialogRef.close();
          this.notificationsService.showNotification(
            'Family has been successfully updated'
          );
        },
        error => {
          this.errorMessage = error.error.message;
        }
      );
  }

  onPercentagesSet(percentagesInfo: { value: AdultMember[]; valid: boolean }) {
    this.membersPaymentPercentagesInfo = percentagesInfo;
  }

  private updateFamily(family: MemberFamily) {
    return this.familiesService.updateFamily(family);
  }

  private updatePercentages() {
    const percentages = this.membersPaymentPercentagesInfo.value.map(adult => ({
      userId: adult.userId,
      paymentPercentage: adult.paymentPercentage
    }));
    return this.familiesService.updateMembersPaymentPercentages(
      this.family._id,
      percentages
    );
  }
}
