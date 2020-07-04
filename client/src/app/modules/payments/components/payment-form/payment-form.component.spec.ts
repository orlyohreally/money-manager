// tslint:disable-next-line: max-line-length
import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent, MockDirective } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { CloseDialogButtonComponent } from '@shared-client/components/close-dialog-button/close-dialog-button.component';
// tslint:disable-next-line: max-line-length
import { ContentWithLoaderComponent } from '@shared-client/components/content-with-loader/content-with-loader.component';
// tslint:disable-next-line: max-line-length
import { DatetimeSelectorComponent } from '@shared-client/components/datetime-selector/datetime-selector.component';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectSelectorComponent } from '@shared-client/components/payment-subject-selector/payment-subject-selector.component';
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
import { DeleteFamilyPaymentDialogTriggerDirective } from '../../directives/delete-family-payment-dialog-trigger.directive';
// tslint:disable-next-line: max-line-length
import { PaymentHeaderComponent } from '../payment-header/payment-header.component';
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
        MockComponent(ContentWithLoaderComponent),
        MockComponent(DatetimeSelectorComponent),
        MockComponent(PaymentHeaderComponent),
        MockComponent(CloseDialogButtonComponent),
        MockDirective(DeleteFamilyPaymentDialogTriggerDirective),
        MockComponent(PaymentSubjectSelectorComponent)
      ],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
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
    setPaidAtDate(mockedPaymentDate);
    setSubjectId(mockedSubjectList[0]._id);
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
      setPaidAtDate('07.05.2020');
      setSubjectId(mockedSubjectList[0]._id);
      await setSelectorOption(fixture, 'payment-payer', 0);
      submitForm();
      expect(component.formSubmitted.emit).not.toHaveBeenCalled();
    }
  );

  it('should not call formSubmitted.emit if amount is not set', async () => {
    spyOn(component.formSubmitted, 'emit');
    setInputField(fixture, 'payment-amount', '');
    setPaidAtDate('07.05.2020');
    setSubjectId(mockedSubjectList[0]._id);
    await setSelectorOption(fixture, 'payment-payer', 0);
    submitForm();
    expect(component.formSubmitted.emit).not.toHaveBeenCalled();
  });
  it('should not call formSubmitted.emit if amount is 0', async () => {
    spyOn(component.formSubmitted, 'emit');
    setInputField(fixture, 'payment-amount', '0');
    setPaidAtDate('07.05.2020');
    setSubjectId(mockedSubjectList[0]._id);
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
      setPaidAtDate('07.05.2020');
      setSubjectId(mockedSubjectList[0]._id);
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
    setPaidAtDate('07.05.2020');
    setSubjectId(mockedSubjectList[1]._id);
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
    setPaidAtDate('07.05.2020');
    setSubjectId(mockedSubjectList[1]._id);
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

  function setPaidAtDate(paidAtDate: string) {
    const paidAtEl: DatetimeSelectorComponent = fixture.debugElement.query(
      By.directive(DatetimeSelectorComponent)
    ).componentInstance;
    paidAtEl.dateSelected.emit(new Date(paidAtDate));
  }

  function setSubjectId(subjectId: string) {
    // tslint:disable-next-line: max-line-length
    const paidAtEl: PaymentSubjectSelectorComponent = fixture.debugElement.query(
      By.directive(PaymentSubjectSelectorComponent)
    ).componentInstance;
    paidAtEl.subjectSelected.emit(subjectId);
  }
});
