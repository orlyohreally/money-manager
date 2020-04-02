import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// tslint:disable-next-line: max-line-length
import { MemberPaymentPercentageComponent } from './member-payment-percentage.component';

@Component({
  template: `
    <member-payment-percentage
      [adultMember]="adultMember"
      [adultMemberPercentageForm]="adultMemberPercentageForm"
    ></member-payment-percentage>
  `
})
class ParentComponent {
  adultMember: {
    fullName: string;
    memberId: { familyId: string; userId: string };
    paymentPercentage: number;
  };
  adultMemberPercentageForm: FormGroup;

  @ViewChild(MemberPaymentPercentageComponent)
  memberPaymentPercentageComponent: MemberPaymentPercentageComponent;
}

describe('MemberPaymentPercentageComponent', () => {
  let component: MemberPaymentPercentageComponent;
  let parentComponent: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberPaymentPercentageComponent, ParentComponent],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    parentComponent = fixture.componentInstance;
    parentComponent.adultMemberPercentageForm = new FormGroup({
      userId: new FormControl('memberId-1'),
      paymentPercentage: new FormControl('100', [])
    });
    parentComponent.adultMember = {
      fullName: 'fullName-1',
      memberId: { familyId: 'familyId-1', userId: 'memberId-1' },
      paymentPercentage: 100
    };
    fixture.detectChanges();
    component = parentComponent.memberPaymentPercentageComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
