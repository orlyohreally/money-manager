import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FamilyMember } from '@shared/types';

@Component({
  selector: 'member-payment-percentage',
  templateUrl: './member-payment-percentage.component.html',
  styleUrls: ['./member-payment-percentage.component.scss']
})
export class MemberPaymentPercentageComponent implements OnInit {
  @Input() member: FamilyMember;
  @Input() memberPercentageForm: FormGroup;

  constructor() {}

  ngOnInit() {}

  resetPercentage() {
    this.memberPercentageForm.get('paymentPercentage').setValue(0);
  }

  get percentage() {
    return this.memberPercentageForm.get('paymentPercentage');
  }
}
