import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '@core-client/services/payment-subject/payment-subjects.service';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
import {
  AuthenticationServiceMock,
  FamiliesServiceMock,
  getNotificationsSpy,
  MembersServiceMock,
  PaymentsServiceMock,
  PaymentSubjectsServiceMock
} from '@src/app/tests-utils/mocks';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { NewPaymentFormComponent } from './new-payment-form.component';

describe('NewPaymentFormComponent', () => {
  let component: NewPaymentFormComponent;
  let fixture: ComponentFixture<NewPaymentFormComponent>;
  let dialogRefSpy: MatDialogRef<NewPaymentFormComponent>;
  let paymentsServiceSpy: jasmine.SpyObj<PaymentsService>;
  let paymentSubjectsServiceSpy: jasmine.SpyObj<PaymentSubjectsService>;
  let membersServiceSpy: jasmine.SpyObj<MembersService>;
  let familiesServiceSpy: jasmine.SpyObj<FamiliesService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationsService>;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;

  const paymentsServiceMock = PaymentsServiceMock();
  const paymentSubjectsServiceMock = PaymentSubjectsServiceMock();
  const membersServiceMock = MembersServiceMock();
  const familiesServiceMock = FamiliesServiceMock();
  const authenticationServiceMock = AuthenticationServiceMock();

  beforeEach(async(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    paymentsServiceSpy = paymentsServiceMock.service;
    paymentSubjectsServiceSpy = paymentSubjectsServiceMock.service;
    membersServiceSpy = membersServiceMock.getService();
    familiesServiceSpy = familiesServiceMock.service;
    notificationServiceSpy = getNotificationsSpy();
    authenticationServiceSpy = authenticationServiceMock.getService();

    TestBed.configureTestingModule({
      declarations: [
        NewPaymentFormComponent,
        MockComponent(PaymentFormComponent)
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: PaymentsService, useValue: paymentsServiceSpy },
        {
          provide: PaymentSubjectsService,
          useValue: paymentSubjectsServiceSpy
        },
        { provide: MembersService, useValue: membersServiceSpy },
        { provide: FamiliesService, useValue: familiesServiceSpy },
        { provide: NotificationsService, useValue: notificationServiceSpy },
        { provide: AuthenticationService, useValue: authenticationServiceSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { defaultUserId: 'userId-1', familyId: 'familyId-1' }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
