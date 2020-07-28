import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { MonthlyExpensesReportComponent } from './monthly-expenses-report/monthly-expenses-report.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsExpensesComponent } from './payment-subjects-expenses/payment-subjects-expenses.component';
import { ReportsComponent } from './reports.component';
// tslint:disable-next-line: max-line-length
import { UserMonthlyExpensesReportComponent } from './user-monthly-expenses-report/user-monthly-expenses-report.component';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportsComponent,
        MockComponent(MonthlyExpensesReportComponent),
        MockComponent(PaymentSubjectsExpensesComponent),
        MockComponent(UserMonthlyExpensesReportComponent)
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of(convertToParamMap({ familyId: 'family-id' }))
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
