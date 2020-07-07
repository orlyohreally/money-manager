import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// tslint:disable-next-line: max-line-length
import { PaymentSubjectsExpensesComponent } from './payment-subjects-expenses.component';

describe('PaymentSubjectsExpensesComponent', () => {
  let component: PaymentSubjectsExpensesComponent;
  let fixture: ComponentFixture<PaymentSubjectsExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentSubjectsExpensesComponent]
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
