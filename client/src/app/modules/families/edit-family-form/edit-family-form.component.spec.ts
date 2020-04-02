import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatCheckboxModule,
  MatDialogRef,
  MatInputModule
} from '@angular/material';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
import { Family } from '@shared/types';
import {
  FamiliesServiceMock,
  IFamiliesServiceMock
} from '@src/app/tests-utils/mocks/families.service.spec';
import {
  IMembersServiceMock,
  MembersServiceMock
} from '@src/app/tests-utils/mocks/members.service.spec';
import { getNotificationsSpy } from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { MembersPaymentPercentageComponent } from '../../members/components/members-payment-percentage/members-payment-percentage.component';
import { FamilyFormComponent } from '../family-form/family-form.component';
import { EditFamilyFormComponent } from './edit-family-form.component';

describe('EditFamilyFormComponent', () => {
  let component: EditFamilyFormComponent;
  let fixture: ComponentFixture<EditFamilyFormComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EditFamilyFormComponent>>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;

  const mockedFamily: Family = { name: 'familyName' } as Family;
  const familiesServiceMock: IFamiliesServiceMock = FamiliesServiceMock();
  const membersServiceMock: IMembersServiceMock = MembersServiceMock();

  beforeEach(async(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    notificationsServiceSpy = getNotificationsSpy();

    TestBed.configureTestingModule({
      declarations: [
        EditFamilyFormComponent,
        MockComponent(FamilyFormComponent),
        MockComponent(MembersPaymentPercentageComponent)
      ],
      imports: [MatCheckboxModule, MatInputModule, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockedFamily },
        { provide: FamiliesService, useValue: familiesServiceMock.service },
        { provide: MembersService, useValue: membersServiceMock.service },
        { provide: NotificationsService, useValue: notificationsServiceSpy }
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
