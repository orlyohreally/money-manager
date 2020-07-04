import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
import { Family } from '@shared/types';
import {
  FamiliesServiceMock,
  IFamiliesServiceMock,
  IMembersServiceMock,
  MembersServiceMock
} from '@tests-utils/mocks';
import {
  getNotificationsSpy,
  IPaymentsServiceMock,
  PaymentsServiceMock
} from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { MembersPaymentPercentageComponent } from '../../members/components/members-payment-percentage/members-payment-percentage.component';
import { FamilyFormComponent } from '../family-form/family-form.component';
import { EditFamilyFormComponent } from './edit-family-form.component';

describe('EditFamilyFormComponent', () => {
  let component: EditFamilyFormComponent;
  let fixture: ComponentFixture<EditFamilyFormComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EditFamilyFormComponent>>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;
  let paymentsServiceSpy: jasmine.SpyObj<PaymentsService>;

  const mockedFamily: Family = { name: 'familyName' } as Family;
  const familiesServiceMock: IFamiliesServiceMock = FamiliesServiceMock();
  const membersServiceMock: IMembersServiceMock = MembersServiceMock();
  const paymentsServiceMock: IPaymentsServiceMock = PaymentsServiceMock();

  beforeEach(async(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    notificationsServiceSpy = getNotificationsSpy();
    paymentsServiceSpy = paymentsServiceMock.service;

    TestBed.configureTestingModule({
      declarations: [
        EditFamilyFormComponent,
        MockComponent(FamilyFormComponent),
        MockComponent(MembersPaymentPercentageComponent)
      ],
      imports: [MatCheckboxModule, MatInputModule, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockedFamily },
        { provide: FamiliesService, useValue: familiesServiceMock.service },
        { provide: MembersService, useValue: membersServiceMock.getService() },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
        { provide: PaymentsService, useValue: paymentsServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFamilyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
