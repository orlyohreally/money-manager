import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { cold, getTestScheduler } from 'jasmine-marbles';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import { DialogService } from '@core-client/services/dialog/dialog.service';
import { MembersService } from '@core-client/services/members/members.service';
import { FamilyPaymentView } from '@src/app/types';
import {
  AuthenticationServiceMock,
  MembersServiceMock,
  PaymentsServiceMock
} from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { EditPaymentFormComponent } from '../components/edit-payment-form/edit-payment-form.component';
// tslint:disable-next-line: max-line-length
import { PaymentDetailsComponent } from '../components/payment-details/payment-details.component';
// tslint:disable-next-line: max-line-length
import { ViewFamilyPaymentDialogTriggerDirective } from './view-family-payment-dialog-trigger.directive';

@Component({
  template: `
    <div [paymentViewFamilyPayment]="payment" [familyId]="familyId"></div>
  `
})
class TestComponent {
  familyId: string;
  payment: FamilyPaymentView;
}

describe('ViewFamilyPaymentDialogTriggerDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dialogSpy: jasmine.SpyObj<DialogService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let membersServiceSpy: jasmine.SpyObj<MembersService>;

  const authenticationServiceMock = AuthenticationServiceMock();
  const membersServiceMock = MembersServiceMock();
  const mockedFamilyPayment = PaymentsServiceMock().familyPayments[0];
  const mockedFamilyId = 'familyId-1';

  beforeEach(async(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    authServiceSpy = authenticationServiceMock.getService();
    membersServiceSpy = membersServiceMock.getService();

    TestBed.configureTestingModule({
      declarations: [TestComponent, ViewFamilyPaymentDialogTriggerDirective],
      providers: [
        { provide: DialogService, useValue: dialogSpy },
        { provide: MembersService, useValue: membersServiceSpy },
        { provide: AuthenticationService, useValue: authServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.payment = mockedFamilyPayment;
    component.familyId = mockedFamilyId;
    fixture.detectChanges();
  });

  describe('User is family admin', () => {
    beforeEach(() => {
      membersServiceSpy.userIsFamilyAdmin.and.returnValue(
        cold('---a', { a: true })
      );
    });

    it(
      'should open dialog with Component EditPaymentFormComponent and data' +
        ' {isAdminMode: true, familyId: "familyId-1", payment: mocked payment',
      () => {
        triggerDirective();
        expect(membersServiceSpy.userIsFamilyAdmin).toHaveBeenCalledTimes(1);
        expect(membersServiceSpy.userIsFamilyAdmin).toHaveBeenCalledWith(
          authenticationServiceMock.user._id,
          mockedFamilyId
        );
        expect(dialogSpy.open).toHaveBeenCalledTimes(1);
        expect(dialogSpy.open).toHaveBeenCalledWith(
          EditPaymentFormComponent,
          jasmine.objectContaining({
            data: {
              isAdminMode: true,
              familyId: mockedFamilyId,
              payment: mockedFamilyPayment
            }
          })
        );
      }
    );
  });

  describe('User is payer of the payment', () => {
    const usersPayment: FamilyPaymentView = {
      ...mockedFamilyPayment,
      member: {
        ...{
          ...mockedFamilyPayment.member,
          _id: authenticationServiceMock.user._id
        }
      }
    };

    beforeEach(() => {
      membersServiceSpy.userIsFamilyAdmin.and.returnValue(
        cold('---a', { a: false })
      );
      component.payment = usersPayment;
      fixture.detectChanges();
    });

    it(
      'should open dialog with Component EditPaymentFormComponent and data' +
        ' {isAdminMode: true, familyId: "familyId-1", payment: mocked payment',
      () => {
        triggerDirective();
        expect(membersServiceSpy.userIsFamilyAdmin).toHaveBeenCalledTimes(1);
        expect(membersServiceSpy.userIsFamilyAdmin).toHaveBeenCalledWith(
          authenticationServiceMock.user._id,
          mockedFamilyId
        );
        expect(dialogSpy.open).toHaveBeenCalledTimes(1);
        expect(dialogSpy.open).toHaveBeenCalledWith(
          EditPaymentFormComponent,
          jasmine.objectContaining({
            data: {
              isAdminMode: false,
              familyId: mockedFamilyId,
              payment: usersPayment
            }
          })
        );
      }
    );
  });

  describe('User is neither  payer of the payment nor family admin', () => {
    const anotherUsersPayment: FamilyPaymentView = {
      ...mockedFamilyPayment,
      member: {
        ...{
          ...mockedFamilyPayment.member,
          _id: `not-${authenticationServiceMock.user._id}`
        }
      }
    };

    beforeEach(() => {
      membersServiceSpy.userIsFamilyAdmin.and.returnValue(
        cold('---a', { a: false })
      );

      component.payment = anotherUsersPayment;
      fixture.detectChanges();
    });

    it(
      'should open dialog with Component EditPaymentFormComponent and data' +
        ' {isAdminMode: true, familyId: "familyId-1", payment: mocked payment',
      () => {
        triggerDirective();
        expect(membersServiceSpy.userIsFamilyAdmin).toHaveBeenCalledTimes(1);
        expect(membersServiceSpy.userIsFamilyAdmin).toHaveBeenCalledWith(
          authenticationServiceMock.user._id,
          mockedFamilyId
        );
        expect(dialogSpy.open).toHaveBeenCalledTimes(1);
        expect(dialogSpy.open).toHaveBeenCalledWith(
          PaymentDetailsComponent,
          jasmine.objectContaining({
            width: '40%',
            data: {
              payment: anotherUsersPayment
            }
          })
        );
      }
    );
  });

  function triggerDirective() {
    fixture.nativeElement.querySelector('div').click();
    getTestScheduler().flush();
  }
});
