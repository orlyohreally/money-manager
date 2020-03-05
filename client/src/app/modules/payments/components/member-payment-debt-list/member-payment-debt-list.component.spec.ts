import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// tslint:disable-next-line: max-line-length
import { MemberPaymentDebtListComponent } from './member-payment-debt-list.component';

describe('MemberPaymentDebtListComponent', () => {
  let component: MemberPaymentDebtListComponent;
  let fixture: ComponentFixture<MemberPaymentDebtListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberPaymentDebtListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPaymentDebtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
