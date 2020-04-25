import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import {
  IMembersServiceMock,
  IUserManagerServiceMock,
  MembersServiceMock,
  UserManagerServiceMock
} from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { MemberPaymentPercentageComponent } from '../member-payment-percentage/member-payment-percentage.component';
// tslint:disable-next-line: max-line-length
import { MembersPaymentPercentageComponent } from './members-payment-percentage.component';

describe('MembersPaymentPercentageComponent', () => {
  let component: MembersPaymentPercentageComponent;
  let fixture: ComponentFixture<MembersPaymentPercentageComponent>;
  let membersServiceSpy: jasmine.SpyObj<MembersService>;
  let userManagerServiceSpy: jasmine.SpyObj<UserManagerService>;

  const membersServiceMock: IMembersServiceMock = MembersServiceMock();
  // tslint:disable-next-line: max-line-length
  const userManagerServiceMock: IUserManagerServiceMock = UserManagerServiceMock();

  beforeEach(async(() => {
    membersServiceSpy = membersServiceMock.getService();
    userManagerServiceSpy = userManagerServiceMock.service;

    TestBed.configureTestingModule({
      declarations: [
        MembersPaymentPercentageComponent,
        MockComponent(LoaderComponent),
        MockComponent(MembersPaymentPercentageComponent),
        MockComponent(MemberPaymentPercentageComponent)
      ],
      imports: [RouterTestingModule, MatIconModule, ReactiveFormsModule],
      providers: [
        { provide: UserManagerService, useValue: userManagerServiceSpy },
        { provide: MembersService, useValue: membersServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersPaymentPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    getTestScheduler().flush();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(
    'form should be invalid' +
      ' when paymentPercentage are valid float numbers',
    () => {
      component.paymentsPercentagesList.controls[0]
        .get('paymentPercentage')
        .setValue('40,23');
      component.paymentsPercentagesList.controls[1]
        .get('paymentPercentage')
        .setValue('59.77');
      expect(component.paymentsPercentagesForm.valid).toBe(false);
      expect(component.paymentsPercentagesList.controls[0].valid).toEqual(
        false
      );
      expect(
        component.paymentsPercentagesList.controls[0]
          .get('paymentPercentage')
          .hasError('invalid-percent')
      ).toEqual(true);
    }
  );

  it(
    'form should be valid' +
      ' when paymentPercentage are valid float percent values',
    () => {
      component.paymentsPercentagesList.controls[0]
        .get('paymentPercentage')
        .setValue('40.23');
      component.paymentsPercentagesList.controls[1]
        .get('paymentPercentage')
        .setValue('59.77');
      expect(component.paymentsPercentagesForm.valid).toBe(true);
      expect(component.paymentsPercentagesList.controls[0].valid).toEqual(true);
      expect(
        component.paymentsPercentagesList.controls[0]
          .get('paymentPercentage')
          .hasError('invalid-percent')
      ).toEqual(false);
    }
  );

  it(
    'form should be invalid' +
      ' when paymentPercentages together not equal 100',
    () => {
      component.paymentsPercentagesList.controls[0]
        .get('paymentPercentage')
        .setValue('41.23');
      component.paymentsPercentagesList.controls[1]
        .get('paymentPercentage')
        .setValue('59.77');
      expect(component.paymentsPercentagesForm.valid).toBe(false);
      expect(
        component.paymentsPercentagesForm
          .get('paymentsPercentages')
          .hasError('total-percentage')
      ).toBe(true);
    }
  );

  it(
    'form should be valid' + ' when paymentPercentages together equal 100',
    () => {
      component.paymentsPercentagesList.controls[0]
        .get('paymentPercentage')
        .setValue('40.23');
      component.paymentsPercentagesList.controls[1]
        .get('paymentPercentage')
        .setValue('59.77');
      expect(component.paymentsPercentagesForm.valid).toBe(true);
    }
  );
});
