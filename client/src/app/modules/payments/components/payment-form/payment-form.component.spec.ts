import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule
} from '@angular/material';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { Component, ViewChild } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// tslint:disable-next-line: max-line-length
import { ContentWithLoaderComponent } from '@shared-client/components/content-with-loader/content-with-loader.component';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectComponent } from '@shared-client/components/payment-subject/payment-subject.component';
import { FamilyMember, Payment, PaymentSubject, User } from '@shared/types';
import {
  AuthenticationServiceMock,
  CurrencySymbolPipeMock,
  FamilyMemberIconPipeMock,
  MembersServiceMock,
  PaymentsServiceMock,
  PaymentSubjectsServiceMock,
  UserFullNamePipeMock
} from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { PaymentFormComponent } from './payment-form.component';

@Component({
  template: `
    <payment-form
      [payment]="payment"
      [adminView]="adminView"
      [subjects]="subjects"
      [defaultPayer]="defaultPayer"
      [payersList]="payerList"
      [errorMessage]="errorMessage"
      [submittingForm]="submittingForm"
    ></payment-form>
  `
})
class ParentComponent {
  payment: Payment & { currency: string };
  adminView: boolean;
  subjects: PaymentSubject[];
  defaultPayer: User;
  payersList: FamilyMember[];
  errorMessage: string;
  submittingForm: boolean;

  @ViewChild(PaymentFormComponent) paymentFormComponent: PaymentFormComponent;
}

describe('PaymentFormComponent', () => {
  let component: PaymentFormComponent;
  let parentComponent: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaymentFormComponent,
        ParentComponent,
        FamilyMemberIconPipeMock,
        UserFullNamePipeMock,
        CurrencySymbolPipeMock,
        MockComponent(LoaderComponent),
        MockComponent(PaymentSubjectComponent),
        MockComponent(ContentWithLoaderComponent)
      ],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        MatNativeDateModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    parentComponent = fixture.componentInstance;
    parentComponent.payment = {
      ...PaymentsServiceMock().payment,
      currency: 'USD'
    };
    parentComponent.adminView = true;
    parentComponent.subjects = PaymentSubjectsServiceMock().paymentSubjectsList;
    parentComponent.defaultPayer = AuthenticationServiceMock().user;
    parentComponent.payersList = MembersServiceMock().membersList;
    parentComponent.submittingForm = true;
    fixture.detectChanges();
    component = parentComponent.paymentFormComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
