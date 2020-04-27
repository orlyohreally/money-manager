import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { startWith, switchMap, take, takeUntil } from 'rxjs/operators';

import { MembersService } from '@core-client/services/members/members.service';
import { FamilyMember } from '@shared/types';
import { AdultMember } from '@src/app/types/adult-member';

@Component({
  selector: 'member-members-payment-percentage',
  templateUrl: './members-payment-percentage.component.html',
  styleUrls: ['./members-payment-percentage.component.scss']
})
export class MembersPaymentPercentageComponent implements OnInit, OnDestroy {
  @Input() familyId: string;
  @Input() newFamilyMember: boolean;

  @Output() valueUpdated = new EventEmitter<{
    value: AdultMember[];
    valid: boolean;
  }>();

  members: Observable<FamilyMember[]>;
  paymentsPercentagesForm: FormGroup;

  private destroyed = new Subject<void>();

  constructor(
    private membersService: MembersService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.members = this.membersService.getMembers(this.familyId).pipe(
      take(1),
      switchMap(members => {
        const newMember = {
          _id: '',
          firstName: 'new member',
          lastName: '',
          paymentPercentage: 0
        } as FamilyMember;
        const payers = this.newFamilyMember ? [...members, newMember] : members;
        this.initForm(payers);
        return of(payers);
      })
    );
  }

  get paymentsPercentagesList(): FormArray {
    return this.paymentsPercentagesForm.get('paymentsPercentages') as FormArray;
  }

  trackByFn(index: any) {
    return index;
  }

  private initForm(members: FamilyMember[]) {
    const percentages: FormGroup[] = members.reduce(
      (res: FormGroup[], member) => [
        ...res,
        this.createPercentageFormGroup(member)
      ],
      []
    );
    this.paymentsPercentagesForm = this.formBuilder.group({
      paymentsPercentages: this.formBuilder.array(percentages, [
        Validators.required,
        this.totalHundredValidation()
      ])
    });
    this.paymentsPercentagesForm.valueChanges
      .pipe(
        takeUntil(this.destroyed),
        startWith(this.paymentsPercentagesForm.getRawValue())
      )
      .subscribe(currentValue => {
        this.valueUpdated.emit({
          value: currentValue.paymentsPercentages,
          valid: this.paymentsPercentagesForm.valid
        });
      });
  }

  private createPercentageFormGroup(member: FamilyMember): FormGroup {
    return this.formBuilder.group({
      userId: new FormControl(member._id),
      paymentPercentage: new FormControl(member.paymentPercentage, [
        this.percentValidation()
      ])
    });
  }

  private totalHundredValidation(): ValidatorFn {
    return (formArray: FormArray): { 'total-percentage': boolean } | null => {
      const totalPercentage = formArray.controls.reduce((res, control) => {
        const currentValue = parseFloat(
          control.get('paymentPercentage').value || 0
        );
        return res + currentValue;
      }, 0);
      return totalPercentage === 100 ? null : { 'total-percentage': true };
    };
  }

  private percentValidation(): ValidatorFn {
    return (control: FormControl): { 'invalid-percent': boolean } | null => {
      const parsedValue = parseFloat(control.value);
      const invalidPercentValue =
        parsedValue.toString() !== (control.value || 0).toString() ||
        parsedValue > 100 ||
        parsedValue < 0;
      return invalidPercentValue ? { 'invalid-percent': true } : null;
    };
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
