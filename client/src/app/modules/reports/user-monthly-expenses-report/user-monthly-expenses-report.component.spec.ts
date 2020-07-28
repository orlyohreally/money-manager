import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
import { PaymentsCalculationsServiceMock } from '@src/app/tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { YearSelectorComponent } from '../year-selector/year-selector.component';
// tslint:disable-next-line: max-line-length
import { UserMonthlyExpensesReportComponent } from './user-monthly-expenses-report.component';

describe('UserMonthlyExpensesReportComponent', () => {
  let component: UserMonthlyExpensesReportComponent;
  let fixture: ComponentFixture<UserMonthlyExpensesReportComponent>;
  let calculationsServiceSpy: jasmine.SpyObj<PaymentsCalculationsService>;

  const calculationsServiceMock = PaymentsCalculationsServiceMock();

  beforeEach(async(() => {
    calculationsServiceSpy = calculationsServiceMock.service;

    TestBed.configureTestingModule({
      declarations: [
        UserMonthlyExpensesReportComponent,
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
    fixture = TestBed.createComponent(UserMonthlyExpensesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
