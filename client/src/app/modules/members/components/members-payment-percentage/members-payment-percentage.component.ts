import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
import { FamilyMember } from '@shared/types';
import { MembersService } from '@src/app/core/services/members/members.service';
import { AdultMember } from '@src/app/types/adult-member';
import { Subject } from 'rxjs';
import { startWith, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'member-members-payment-percentage',
  templateUrl: './members-payment-percentage.component.html',
  styleUrls: ['./members-payment-percentage.component.scss']
})
export class MembersPaymentPercentageComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() familyId: string;
  @Input() newFamilyMemberRoles: boolean;

  @Output() valueUpdated = new EventEmitter<{
    value: AdultMember[];
    valid: boolean;
  }>();

  adultMembers: AdultMember[];
  paymentsPercentages: FormGroup;

  private destroyed = new Subject<void>();

  constructor(
    private membersService: MembersService,
    private userManagerService: UserManagerService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.membersService
      .getMembers(this.familyId)
      .pipe(take(1))
      .subscribe((members: FamilyMember[]) => {
        this.adultMembers = members
          .filter(member => this.membersService.memberIsAdult(member.roles))
          .map(member => ({
            fullName: this.userManagerService.getFullName(member),
            userId: member._id,
            paymentPercentage: member.paymentPercentage
          }));
        this.initForm(this.adultMembers);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.newFamilyMemberRoles || !this.paymentsPercentages) {
      return;
    }
    const memberIsAdult = this.membersService.memberIsAdult(
      changes.newFamilyMemberRoles.currentValue
    );
    const memberWasAdult = this.membersService.memberIsAdult(
      changes.newFamilyMemberRoles.previousValue
    );
    if (memberIsAdult === memberWasAdult) {
      return;
    }
    if (memberIsAdult) {
      this.addAdultMember();
      return;
    }
    this.removeNewAdultMember();
  }

  get paymentsPercentagesList(): FormArray {
    return this.paymentsPercentages.get('paymentsPercentages') as FormArray;
  }

  trackByFn(index: any) {
    return index;
  }

  private initForm(members: AdultMember[]) {
    const percentages: FormGroup[] = members.reduce(
      (res: FormGroup[], member) => [
        ...res,
        this.createPercentageFormGroup(member)
      ],
      []
    );
    this.paymentsPercentages = this.formBuilder.group({
      paymentsPercentages: this.formBuilder.array(percentages, [
        Validators.required,
        this.totalHundredValidation()
      ])
    });

    this.paymentsPercentages.valueChanges
      .pipe(
        takeUntil(this.destroyed),
        startWith(this.paymentsPercentages.getRawValue())
      )
      .subscribe(currentValue => {
        this.valueUpdated.emit({
          value: currentValue.paymentsPercentages,
          valid: this.paymentsPercentages.valid
        });
      });
  }

  private createPercentageFormGroup(member: AdultMember): FormGroup {
    return this.formBuilder.group({
      userId: new FormControl(member.userId),
      paymentPercentage: new FormControl(member.paymentPercentage, [
        this.percentValidation()
      ])
    });
  }

  private totalHundredValidation(): ValidatorFn {
    return (formArray: FormArray): { [key: string]: any } | null => {
      const totalPercentage = formArray.controls.reduce((res, control) => {
        const currentValue = control.get('paymentPercentage').value
          ? parseInt(control.get('paymentPercentage').value, 10)
          : 0;
        return res + currentValue;
      }, 0);
      return totalPercentage === 100 ? null : { totalPercentage: true };
    };
  }

  private percentValidation(): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      const parsedValue = parseInt(control.value, 10);
      const invalidPercentValue =
        parsedValue.toString() !== (control.value || 0).toString() ||
        parsedValue > 100 ||
        parsedValue < 0;

      return invalidPercentValue ? { 'invalid-percent': true } : null;
    };
  }

  private addAdultMember() {
    const newAdultMember = {
      fullName: 'new member',
      userId: '',
      paymentPercentage: 0
    };
    this.adultMembers = [...this.adultMembers, newAdultMember];
    this.paymentsPercentagesList.push(
      this.createPercentageFormGroup(newAdultMember)
    );
  }

  private removeNewAdultMember() {
    this.adultMembers.splice(this.adultMembers.length - 1);
    this.paymentsPercentagesList.removeAt(
      this.paymentsPercentagesList.length - 1
    );
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
