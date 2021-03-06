import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UserFullNamePipeMock } from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { MemberPaymentPercentageComponent } from './member-payment-percentage.component';

@Component({
  template: `
    <member-payment-percentage
      [member]="adultMember"
      [memberPercentageForm]="adultMemberPercentageForm"
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
      declarations: [
        MemberPaymentPercentageComponent,
        ParentComponent,
        UserFullNamePipeMock
      ],
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
