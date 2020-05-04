import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { of, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
import { Family } from '@shared/types';
import { nameValidatorFn } from '@shared/utils';
import { AdultMember } from '@src/app/types';

@Component({
  selector: 'family-edit-family-form',
  templateUrl: './edit-family-form.component.html',
  styleUrls: ['./edit-family-form.component.scss']
})
export class EditFamilyFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;

  errorMessage: string;
  submittingForm = false;
  displayExchangeRate: boolean;

  private membersPaymentPercentagesInfo: {
    value: AdultMember[];
    valid: boolean;
  };
  private currencyDebounceTime = 300;
  private destroyed = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<EditFamilyFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public family: Family,
    private familiesService: FamiliesService,
    private paymentsService: PaymentsService,
    private membersService: MembersService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.family ? this.family.name : '', [
        Validators.required,
        control => nameValidatorFn(control.value)
      ]),
      icon: new FormControl(this.family ? this.family.icon : ''),
      currency: new FormControl(
        this.family ? this.family.currency : '',
        Validators.required
      ),
      equalPayments: new FormControl(
        this.family ? this.family.equalPayments : true
      ),
      exchangeRate: new FormControl(1, Validators.pattern(/^\d+(\.\d+)?$/))
    });

    this.form
      .get('currency')
      .valueChanges.pipe(
        debounceTime(this.currencyDebounceTime),
        takeUntil(this.destroyed)
      )
      .subscribe(value => {
        this.displayExchangeRate = value !== this.family.currency;
      });
  }

  submitForm() {
    this.errorMessage = null;
    this.submittingForm = true;
    const invalidPercentage =
      !this.membersPaymentPercentagesInfo ||
      !this.membersPaymentPercentagesInfo.valid;
    if (
      !this.form.valid ||
      (!this.form.get('equalPayments').value && invalidPercentage)
    ) {
      this.form.markAsTouched();
      this.submittingForm = false;
      return;
    }
    const { exchangeRate, ...family } = this.form.value;
    this.familiesService
      .updateFamily(
        {
          ...family,
          _id: this.family._id
        },
        this.displayExchangeRate ? exchangeRate : undefined
      )
      .pipe(
        switchMap(() => {
          return this.paymentsService.updatePaymentsByExchangeRate(
            this.family._id,
            exchangeRate
          );
        }),
        switchMap(() => {
          if (this.form.value.equalPayments) {
            return of(undefined);
          }
          return this.updatePercentages();
        })
      )
      .subscribe(
        () => {
          this.submittingForm = false;
          this.dialogRef.close();
          this.notificationsService.showNotification(
            'Family has been successfully updated'
          );
        },
        (error: HttpErrorResponse) => {
          this.submittingForm = false;
          this.errorMessage = error.error.message
            ? error.error.message
            : error.statusText;
        }
      );
  }

  onPercentagesSet(percentagesInfo: { value: AdultMember[]; valid: boolean }) {
    this.membersPaymentPercentagesInfo = percentagesInfo;
  }

  private updatePercentages() {
    const percentages = this.membersPaymentPercentagesInfo.value.map(adult => ({
      userId: adult.userId,
      paymentPercentage: adult.paymentPercentage
    }));
    return this.membersService.updateMembersPaymentPercentages(
      this.family._id,
      percentages
    );
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
