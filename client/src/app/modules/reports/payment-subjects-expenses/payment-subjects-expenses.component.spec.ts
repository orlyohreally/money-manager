import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
import { PaymentsCalculationsServiceMock } from '@src/app/tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { YearSelectorComponent } from '../year-selector/year-selector.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsExpensesComponent } from './payment-subjects-expenses.component';

describe('PaymentSubjectsExpensesComponent', () => {
  let component: PaymentSubjectsExpensesComponent;
  let fixture: ComponentFixture<PaymentSubjectsExpensesComponent>;
  let calculationsServiceSpy: jasmine.SpyObj<PaymentsCalculationsService>;

  const calculationsServiceMock = PaymentsCalculationsServiceMock();

  beforeEach(async(() => {
    calculationsServiceSpy = calculationsServiceMock.service;

    TestBed.configureTestingModule({
      declarations: [
        PaymentSubjectsExpensesComponent,
        MockComponent(YearSelectorComponent)
      ],
      providers: [
        {
          provide: PaymentsCalculationsService,
          useValue: calculationsServiceSpy
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSubjectsExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
