// tslint:disable-next-line: max-line-length
import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { ContentWithLoaderComponent } from '@shared-client/components/content-with-loader/content-with-loader.component';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectComponent } from '@shared-client/components/payment-subject/payment-subject.component';
import { FamilyMember, Payment, PaymentSubject, User } from '@shared/types';
import {
  setInputField,
  setSelectorOption
} from '@src/app/tests-utils/functions';
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
      [payersList]="payersList"
      [errorMessage]="errorMessage"
      [submittingForm]="submittingForm"
      formLabel="Payment"
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

  const mockedMembersList = MembersServiceMock().membersList;
  const mockedSubjectList = PaymentSubjectsServiceMock().paymentSubjectsList;
  const mockedPayment = PaymentsServiceMock().payment;

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
      ...mockedPayment,
      currency: 'USD'
    };
    parentComponent.adminView = true;
    parentComponent.subjects = mockedSubjectList;
    parentComponent.defaultPayer = AuthenticationServiceMock().user;
    parentComponent.payersList = mockedMembersList;
    parentComponent.submittingForm = true;
    fixture.detectChanges();
    component = parentComponent.paymentFormComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call formSubmitted.emit if form is valid', async () => {
    const mockedAmount = 40.6;
    const mockedPaymentDate = '07.05.2020';
    spyOn(component.formSubmitted, 'emit');
    setInputField(fixture, 'payment-amount', mockedAmount.toString());
    setInputField(fixture, 'payment-date', mockedPaymentDate);
    await setSelectorOption(fixture, 'payment-subject', 0);
    await setSelectorOption(fixture, 'payment-payer', 0);
    submitForm();
    expect(component.formSubmitted.emit).toHaveBeenCalledTimes(1);
    expect(component.formSubmitted.emit).toHaveBeenCalledWith({
      userId: mockedMembersList[0]._id,
      paidAt: new Date(mockedPaymentDate),
      subjectId: mockedSubjectList[0]._id,
      amount: mockedAmount,
      receipt: mockedPayment.receipt
    });
  });

  it(
    'should not call formSubmitted.emit' +
      ' if amount is not float number over 0 - "4.g"',
    async () => {
      spyOn(component.formSubmitted, 'emit');
      setInputField(fixture, 'payment-amount', '4.g');
      setInputField(fixture, 'payment-date', '07.05.2020');
      await setSelectorOption(fixture, 'payment-subject', 0);
      await setSelectorOption(fixture, 'payment-payer', 0);
      submitForm();
      expect(component.formSubmitted.emit).not.toHaveBeenCalled();
    }
  );

  it('should not call formSubmitted.emit if amount is not set', async () => {
    spyOn(component.formSubmitted, 'emit');
    setInputField(fixture, 'payment-amount', '');
    setInputField(fixture, 'payment-date', '07.05.2020');
    await setSelectorOption(fixture, 'payment-subject', 0);
    await setSelectorOption(fixture, 'payment-payer', 0);
    submitForm();
    expect(component.formSubmitted.emit).not.toHaveBeenCalled();
  });

  it('should not call formSubmitted.emit if amount is 0', async () => {
    spyOn(component.formSubmitted, 'emit');

    setInputField(fixture, 'payment-amount', '0');
    setInputField(fixture, 'payment-date', '07.05.2020');
    await setSelectorOption(fixture, 'payment-subject', 0);
    await setSelectorOption(fixture, 'payment-payer', 0);
    submitForm();
    expect(component.formSubmitted.emit).not.toHaveBeenCalled();
  });

  it(
    'should not call formSubmitted.emit' +
      ' if  amount is not float number over 0 - "-50"',
    async () => {
      spyOn(component.formSubmitted, 'emit');
      setInputField(fixture, 'payment-amount', '-50');
      setInputField(fixture, 'payment-date', '07.05.2020');
      await setSelectorOption(fixture, 'payment-subject', 0);
      await setSelectorOption(fixture, 'payment-payer', 0);
      submitForm();
      expect(component.formSubmitted.emit).not.toHaveBeenCalled();
    }
  );

  it('should call formSubmitted.emit if amount is "40"', async () => {
    const mockedPaymentAmount = 40;
    const mockedPaymentDate = '07.05.2020';
    spyOn(component.formSubmitted, 'emit');
    setInputField(fixture, 'payment-amount', mockedPaymentAmount.toString());
    setInputField(fixture, 'payment-date', '07.05.2020');
    await setSelectorOption(fixture, 'payment-subject', 1);
    await setSelectorOption(fixture, 'payment-payer', 0);
    submitForm();
    expect(component.formSubmitted.emit).toHaveBeenCalledTimes(1);
    expect(component.formSubmitted.emit).toHaveBeenCalledWith({
      userId: mockedMembersList[0]._id,
      paidAt: new Date(mockedPaymentDate),
      subjectId: mockedSubjectList[1]._id,
      amount: mockedPaymentAmount,
      receipt: mockedPayment.receipt
    });
  });

  it('should call formSubmitted.emit if amount is "0.6"', async () => {
    const mockedPaymentAmount = 0.6;
    const mockedPaymentDate = '07.05.2020';
    spyOn(component.formSubmitted, 'emit');
    setInputField(fixture, 'payment-amount', mockedPaymentAmount.toString());
    setInputField(fixture, 'payment-date', '07.05.2020');
    await setSelectorOption(fixture, 'payment-subject', 1);
    await setSelectorOption(fixture, 'payment-payer', 0);
    submitForm();
    expect(component.formSubmitted.emit).toHaveBeenCalledTimes(1);
    expect(component.formSubmitted.emit).toHaveBeenCalledWith({
      userId: mockedMembersList[0]._id,
      paidAt: new Date(mockedPaymentDate),
      subjectId: mockedSubjectList[1]._id,
      amount: mockedPaymentAmount,
      receipt: mockedPayment.receipt
    });
  });

  function submitForm() {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    submitButton.click();
    fixture.detectChanges();
  }
});
