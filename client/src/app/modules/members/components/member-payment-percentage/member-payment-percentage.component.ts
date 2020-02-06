import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'member-payment-percentage',
  templateUrl: './member-payment-percentage.component.html',
  styleUrls: ['./member-payment-percentage.component.scss']
})
export class MemberPaymentPercentageComponent implements OnInit {
  @Input() adultMember: {
    fullName: string;
    memberId: { familyId: string; userId: string };
    paymentPercentage: number;
  };

  @Input() adultMemberPercentageForm: FormGroup;

  constructor() {}

  ngOnInit() {}

  resetPercentage() {
    this.adultMemberPercentageForm.get('paymentPercentage').setValue(0);
  }

  get percentage() {
    return this.adultMemberPercentageForm.get('paymentPercentage');
  }
}
