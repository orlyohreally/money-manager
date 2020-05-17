import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import { PrefixedNumberPipeMock } from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { PaymentActionButtonsComponent } from './payment-action-buttons/payment-action-buttons.component';
import { UserPaymentsListComponent } from './user-payment-list.component';
import { UserPaymentComponent } from './user-payment/user-payment.component';

describe('UserPaymentsListComponent', () => {
  let component: UserPaymentsListComponent;
  let fixture: ComponentFixture<UserPaymentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserPaymentsListComponent,
        PrefixedNumberPipeMock,
        MockComponent(LoaderComponent),
        MockComponent(UserPaymentComponent),
        MockComponent(PaymentActionButtonsComponent)
      ],
      imports: [
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        RouterTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
